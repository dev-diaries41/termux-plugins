#!/data/data/com.termux/files/usr/bin/sh

onMessage() {
  local chatId="$1"  
  local content="$2"

  termux-notification \
    --id "telegram_$chatId" \
    --title "New Telegram Message_$chatId" \
    --content "$content" \
    --button1 "Reply" \
    --button1-action "$PWD/messenger onReply \"$chatId\""
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

  $PWD/messenger sendReply "$chatId" "$reply"
}

sendReply() {
  local chatId="$1"
  local message="$2"

  ts-node $PWD/bot.ts send "$chatId" "$message" && termux-toast "Reply sent to $chatId"
  termux-toast "Reply sent to $chatId"
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
