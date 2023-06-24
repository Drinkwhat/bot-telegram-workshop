const { Keyboard, Key } = require("telegram-keyboard")

module.exports = {
  tempChoice: Keyboard.make([
    Key.callback("caldo", "hot"),
    Key.callback("mite", "mild"),
    Key.callback("freddo", "cold")
  ])
}