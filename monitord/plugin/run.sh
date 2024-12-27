#!/data/data/com.termux/files/usr/bin/sh

# Set the thresholds (percentage)
CPU_THRESHOLD=80
MEMORY_THRESHOLD=80

# Monitoring interval (seconds)
INTERVAL=5

while true; do
  # Get CPU usage as an integer
  CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}' | cut -d'.' -f1)

  # Get memory usage as an integer
  MEMORY_USAGE=$(free | grep "Mem" | awk '{print ($3/$2) * 100}' | cut -d'.' -f1)

  # Check if CPU usage exceeds the threshold
  if [ "$CPU_USAGE" -gt "$CPU_THRESHOLD" ]; then
    termux-notification \
      --title "High CPU Usage Alert!" \
      --content "CPU usage is at ${CPU_USAGE}%, exceeding the threshold of ${CPU_THRESHOLD}%." \
      --priority high
  fi

  # Check if memory usage exceeds the threshold
  if [ "$MEMORY_USAGE" -gt "$MEMORY_THRESHOLD" ]; then
    termux-notification \
      --title "High Memory Usage Alert!" \
      --content "Memory usage is at ${MEMORY_USAGE}%, exceeding the threshold of ${MEMORY_THRESHOLD}%." \
      --priority high
  fi

  # Wait for the defined interval
  sleep $INTERVAL
done
