const { Keyboard, Key } = require("telegram-keyboard")

module.exports = {
  tempChoice: Keyboard.make([
    Key.callback("caldo", "temp-r1"),
    Key.callback("mite", "temp-r2"),
    Key.callback("freddo", "temp-r3"),
  ]),
  keyboard2: Keyboard.make([
    Key.callback("si", "action1"),
    Key.callback("no", "action2"),
  ])
}