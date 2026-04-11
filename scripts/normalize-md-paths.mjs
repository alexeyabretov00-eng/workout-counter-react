/**
 * Заменяет markdown-ссылки с цепочками ../ на пути от корня в обратных кавычках.
 * Запуск из корня репозитория: node scripts/normalize-md-paths.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const roots = ['features', 'fixes']

const linkRe = new RegExp(
  String.raw`\[([^\]]+)\]\((?:\.\./)+(src/[^)]+|docs/[^)]+|features/[^)]+|fixes/[^)]+|README\.md|package\.json|todo\.md)\)`,
  'g',
)

function walkMd(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name)
    if (name.isDirectory()) walkMd(p, out)
    else if (name.name.endsWith('.md')) out.push(p)
  }
  return out
}

function replaceLinks(content) {
  return content.replace(linkRe, (full, label, repoPath) => {
    const base = repoPath.split('/').pop()
    if (label === repoPath || label === base) {
      return `\`${repoPath}\``
    }
    return `\`${label}\` (\`${repoPath}\`)`
  })
}

for (const root of roots) {
  const abs = path.join(process.cwd(), root)
  if (!fs.existsSync(abs)) continue
  for (const file of walkMd(abs)) {
    const before = fs.readFileSync(file, 'utf8')
    const after = replaceLinks(before)
    if (after !== before) {
      fs.writeFileSync(file, after, 'utf8')
      console.log('updated:', path.relative(process.cwd(), file))
    }
  }
}
