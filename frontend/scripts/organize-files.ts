const fs = require('fs').promises;
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

type FileMove = {
  from: string;
  to: string;
};

const fileMoves: FileMove[] = [
  // Pages
  {
    from: path.join(ROOT_DIR, 'pages'),
    to: path.join(SRC_DIR, 'pages')
  },
  // Components
  {
    from: path.join(ROOT_DIR, 'components'),
    to: path.join(SRC_DIR, 'components')
  },
  // Utils
  {
    from: path.join(ROOT_DIR, 'utils'),
    to: path.join(SRC_DIR, 'utils')
  },
  // Styles
  {
    from: path.join(ROOT_DIR, 'styles'),
    to: path.join(SRC_DIR, 'styles')
  },
  // Types
  {
    from: path.join(ROOT_DIR, 'types'),
    to: path.join(SRC_DIR, 'types')
  },
  // Config
  {
    from: path.join(ROOT_DIR, 'config'),
    to: path.join(SRC_DIR, 'config')
  },
  // Middleware
  {
    from: path.join(ROOT_DIR, 'middleware'),
    to: path.join(SRC_DIR, 'middleware')
  }
];

async function copyDir(src: string, dest: string) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
        console.log(`✅ Copied: ${srcPath} -> ${destPath}`);
      }
    }
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      console.error(`❌ Error copying directory: ${src}`, err);
    }
  }
}

async function moveFiles() {
  try {
    await fs.mkdir(SRC_DIR, { recursive: true });

    for (const move of fileMoves) {
      await copyDir(move.from, move.to);
    }

    for (const move of fileMoves) {
      try {
        await fs.rm(move.from, { recursive: true });
        console.log(`🗑️  Removed original directory: ${move.from}`);
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          console.error(`❌ Error removing directory: ${move.from}`, err);
        }
      }
    }

    console.log('✨ File organization complete!');
  } catch (err) {
    console.error('❌ Failed to organize files:', err);
  }
}

moveFiles(); 