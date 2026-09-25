import { createHash } from "node:crypto";
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import sharp from "sharp";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";

const root = process.cwd();
const labels = {
  architecture: "Architecture",
  structure: "Structure",
  interiors: "Interiors",
  landscaping: "Landscaping",
};

const groups = [
  { dir: "architecture", max: 1400, kind: "work" },
  { dir: "structure", max: 1400, kind: "work" },
  { dir: "interiors", max: 1400, kind: "work" },
  { dir: "landscaping", max: 1400, kind: "work" },
  { dir: "teams", max: 720, kind: "people" },
  { dir: "associates", max: 720, kind: "people" },
];

const keep = new Set();

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with ${code}`));
    });
  });
}

async function writeImage(srcPath, outPath, width, extra = {}) {
  const buffer = await readFile(srcPath);
  const hash = createHash("sha1").update(buffer).digest("hex").slice(0, 8);
  const parsed = path.parse(outPath);
  const hashed = path.join(parsed.dir, `${parsed.name}-${hash}${parsed.ext}`);
  const info = await sharp(buffer)
    .rotate()
    .resize({ width, withoutEnlargement: true, ...extra })
    .webp({ quality: 72, effort: 4 })
    .toFile(hashed);
  keep.add(path.resolve(hashed));
  return { file: hashed, width: info.width, height: info.height, bytes: info.size };
}

async function pruneMedia() {
  const mediaRoot = path.join(root, "public", "media");
  const stack = [mediaRoot];
  let removed = 0;
  while (stack.length) {
    const dir = stack.pop();
    let entries = [];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      if (!keep.has(path.resolve(full))) {
        await rm(full, { force: true });
        removed += 1;
        console.log(`prune ${path.relative(root, full)}`);
      }
    }
  }
  if (removed) console.log(`pruned ${removed} stale media files`);
}

const manifest = { hero: null, og: "/og.png", work: [], people: [], clientele: [] };
let heroCandidate = null;

await mkdir(path.join(root, "public", "media"), { recursive: true });
await mkdir(path.join(root, "public", "brand"), { recursive: true });
await mkdir(path.join(root, "src", "data"), { recursive: true });

for (const group of groups) {
  const srcDir = path.join(root, "resource", "img", group.dir);
  const outDir = path.join(root, "public", "media", group.dir);
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(srcDir))
    .filter((file) => /\.(webp|png|jpe?g)$/i.test(file) && file !== "default.webp")
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  let index = 0;
  for (const file of files) {
    index += 1;
    const srcPath = path.join(srcDir, file);
    const id = path.parse(file).name;
    const outPath = path.join(outDir, `${id}.webp`);
    const info = await writeImage(srcPath, outPath, group.max);
    const rel = `/media/${group.dir}/${path.basename(info.file)}`;
    const label = labels[group.dir] ?? group.dir;

    if (group.kind === "work") {
      const sourceMeta = await sharp(srcPath).metadata();
      const ratio = (sourceMeta.width ?? 1) / (sourceMeta.height ?? 1);
      if (group.dir === "interiors" && ratio >= 1.4) {
        if (!heroCandidate || ratio > heroCandidate.ratio) {
          heroCandidate = { srcPath, ratio };
        }
      }
      manifest.work.push({
        src: rel,
        width: info.width,
        height: info.height,
        category: group.dir,
        label,
        alt: `${label} project ${index} by BuildsWorth in Dhanbad`,
      });
    } else {
      manifest.people.push({
        id,
        src: rel,
        width: info.width,
        height: info.height,
      });
    }
    console.log(`${rel}  ${info.width}x${info.height}  ${Math.round(info.bytes / 1024)}KB`);
  }
}

const heroSrc = heroCandidate?.srcPath ?? path.join(root, "resource", "img", "interiors", "1.webp");
const heroOut = path.join(root, "public", "media", "hero.webp");
const hero = await writeImage(heroSrc, heroOut, 1800);
manifest.hero = {
  src: `/media/${path.basename(hero.file)}`,
  width: hero.width,
  height: hero.height,
  alt: "Interior by BuildsWorth in Dhanbad",
};
console.log(`hero ${manifest.hero.src} ${hero.width}x${hero.height} ${Math.round(hero.bytes / 1024)}KB`);

const logoSrc = path.join(root, "resource", "img", "logo", "buildworth_logo-large.png");
await sharp(logoSrc).trim().png().toFile(path.join(root, "public", "brand", "logo.png"));

await sharp(path.join(root, "resource", "img", "logo", "favicon-32x32.png"))
  .png()
  .toFile(path.join(root, "public", "favicon.png"));

const ogWidth = 1200;
const ogHeight = 630;
const whiteLogo = await sharp(logoSrc)
  .trim()
  .resize({ width: 250, withoutEnlargement: true })
  .ensureAlpha()
  .negate({ alpha: false })
  .png()
  .toBuffer();
const logoMeta = await sharp(whiteLogo).metadata();
const logoW = logoMeta.width ?? 250;
const logoH = logoMeta.height ?? 120;
const logoLeft = Math.round((ogWidth - logoW) / 2);
const logoTop = Math.round((ogHeight - logoH) / 2) - 36;
const textY = logoTop + logoH + 72;
const thinFont = await readFile(path.join(root, "resource", "fonts", "Outfit-Light.ttf"));
const thinFontB64 = thinFont.toString("base64");
const scale = 2;
const bw = ogWidth * scale;
const bh = ogHeight * scale;
const bgPixels = Buffer.alloc(bw * bh * 3);
for (let y = 0; y < bh; y++) {
  for (let x = 0; x < bw; x++) {
    const nx = x / (bw - 1);
    const ny = y / (bh - 1);
    const wash = nx * 0.55 + ny * 0.45;
    const vx = Math.min(nx, 1 - nx);
    const vy = Math.min(ny, 1 - ny);
    const edge = Math.min(1, Math.min(vx, vy) * 3.2);
    // Darker forest green wash
    const baseR = 14 - wash * 5 - (1 - edge) * 4;
    const baseG = 34 - wash * 9 - (1 - edge) * 9;
    const baseB = 24 - wash * 7 - (1 - edge) * 7;
    const dither = (Math.random() - 0.5) * 3.2;
    const i = (y * bw + x) * 3;
    bgPixels[i] = Math.max(0, Math.min(255, Math.round(baseR + dither)));
    bgPixels[i + 1] = Math.max(0, Math.min(255, Math.round(baseG + dither)));
    bgPixels[i + 2] = Math.max(0, Math.min(255, Math.round(baseB + dither)));
  }
}
const ogBg = await sharp(bgPixels, { raw: { width: bw, height: bh, channels: 3 } })
  .resize(ogWidth, ogHeight, { kernel: "lanczos3" })
  .png()
  .toBuffer();
const textSvg = Buffer.from(`<svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: "OgThin";
        src: url("data:font/ttf;base64,${thinFontB64}") format("truetype");
        font-weight: 300;
      }
    </style>
  </defs>
  <text x="600" y="${textY}" text-anchor="middle" fill="#d5d0c4" font-family="OgThin, Outfit, sans-serif" font-size="19" font-weight="300" letter-spacing="4">ARCHITECTURE · STRUCTURE · INTERIORS · LANDSCAPING</text>
</svg>`);
const textLayer = await sharp(textSvg).png().toBuffer();
await sharp(ogBg)
  .composite([
    { input: whiteLogo, left: logoLeft, top: logoTop },
    { input: textLayer, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 8 })
  .toFile(path.join(root, "public", "og.png"));
manifest.og = "/og.png";
console.log(`og /og.png  ${ogWidth}x${ogHeight}`);

const clientDir = path.join(root, "public", "media", "clientele");
await mkdir(clientDir, { recursive: true });
const clientFiles = (await readdir(path.join(root, "resource", "img", "clientele")))
  .filter((file) => /\.(webp|png|jpe?g)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
for (const file of clientFiles) {
  const srcPath = path.join(root, "resource", "img", "clientele", file);
  const id = path.parse(file).name;
  const outPath = path.join(clientDir, `${id}.webp`);
  const info = await sharp(srcPath)
    .rotate()
    .resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: 72, effort: 4 })
    .toFile(outPath);
  keep.add(path.resolve(outPath));
  const rel = `/media/clientele/${id}.webp`;
  manifest.clientele.push({ src: rel, width: info.width, height: info.height });
  console.log(`${rel}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}

await pruneMedia();
await writeFile(path.join(root, "src", "data", "media.json"), JSON.stringify(manifest, null, 2));

await mkdir(path.join(root, "public", "video"), { recursive: true });
const videoSrc = path.join(root, "resource", "video", "showcase.mp4");
const videoOut = path.join(root, "public", "video", "showcase.mp4");
try {
  await run(ffmpegPath.path, [
    "-y",
    "-i",
    videoSrc,
    "-vf",
    "scale='min(1280,iw)':-2",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "28",
    "-an",
    "-movflags",
    "+faststart",
    "-pix_fmt",
    "yuv420p",
    videoOut,
  ]);
  const before = (await stat(videoSrc)).size;
  const after = (await stat(videoOut)).size;
  console.log(
    `video /video/showcase.mp4  ${Math.round(before / 1024 / 1024)}MB → ${Math.round(after / 1024 / 1024)}MB`,
  );
} catch (error) {
  console.warn("video compress failed, copying source:", error.message);
  await copyFile(videoSrc, videoOut);
}

console.log(
  `work ${manifest.work.length}  people ${manifest.people.length}  clientele ${manifest.clientele.length}`,
);
