const rightPad = require('right-pad')

const formatCodeBlock = (data = []) => {
  const maxPropertyLength = Object.keys(data[0] || []).reduce((acc, key) => {
    acc[key] = Math.max(...data.map(app => app[key].length), key.length)
    return acc
  }, {})

  const header = Object.keys(maxPropertyLength)
    .map(key => rightPad(key, maxPropertyLength[key] + 1))
    .join('')

  const dashes = Object.keys(maxPropertyLength)
    .map(key => '-'.repeat(maxPropertyLength[key]) + ' ')
    .join('')

  const rows = data
    .map(app =>
      Object.keys(app)
        .map(key => rightPad(app[key], maxPropertyLength[key] + 1))
        .join('')
    )
    .join('\n')

  return header ? header + '\n' + dashes + '\n' + rows : null
}

const formatMarkDown = data => ({
  text: `\`\`\`\n${formatCodeBlock(data)}\n\`\`\``,
  mrkdwn: true
})

module.exports = {
  // formatCodeBlock,
  formatMarkDown
}
