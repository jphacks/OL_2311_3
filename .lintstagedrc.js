const path = require("path")

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(" --file ")}`

const buildPrettierCommand = (filenames) =>
  `prettier --write --ignore-path .prettierignore ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" ")}`

const tscCommand = () => "pnpm exec tsc --noEmit"

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, buildPrettierCommand, tscCommand],
  "*.{js,jsx,ts,tsx,json}": [buildPrettierCommand],
}
