const config = {
  '*.{js,ts,tsx,json,md,mdx,yml,yaml}': ['prettier --write'],
  '*.{ts,tsx,js}': ['eslint --fix --max-warnings=0'],
}

export default config
