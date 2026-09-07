const config = {
  '*.{js,ts,tsx,json,md,mdx,yml,yaml}': ['oxfmt --write'],
  '*.{ts,tsx,js}': ['oxlint'],
}

export default config
