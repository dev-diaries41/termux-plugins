#!/data/data/com.termux/files/usr/bin/sh

SCRIPT_DIR=$(dirname "$(realpath "$0")")

onMessage() {
  local chatId="$1"  
  local content="$2"

  termux-notification \
    --id "telegram_$chatId" \
    --title "New Telegram Message_$chatId" \
    --content "$content" \
    --button1 "Reply" \
    --button1-action "$SCRIPT_DIR/messenger.sh onReply \"$chatId\""
}

onReply() {
  local chatId="$1"
  local reply

  reply=$(termux-dialog text -t "Reply to $chatId" -i "Type your message..." \
          | jq -r '.text')

  if [[ -z "$reply" ]]; then
    termux-toast "Reply canceled or empty!"
    return
  fi

  sendReply "$chatId" "$reply"
}


sendReply() {
  local chatId="$1"
  local message="$2"

  node $SCRIPT_DIR/bot.js send "$chatId" "$message" && termux-toast "Reply sent to $chatId"
}

# Main command dispatcher
case "$1" in
  onMessage)
    onMessage "$2" "$3"
    ;;
  onReply)
    onReply "$2"
    ;;
  sendReply)
    sendReply "$2" "$3"
    ;;
  *)
    echo "Usage: $0 {onMessage <chatId> <content> | onReply <chatId> | sendReply <chatId> <message>}"
    exit 1
    ;;
esac
