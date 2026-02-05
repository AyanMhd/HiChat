export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDateSeparator(date) {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time parts for accurate date comparison
  const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  if (messageDateOnly.getTime() === todayOnly.getTime()) {
    return "Today";
  } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

export function isSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Notification sound for new messages
let notificationAudio = null;
let audioInitialized = false;

// Initialize audio on first user interaction
export function initializeAudio() {
  if (audioInitialized) return;
  try {
    notificationAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
    notificationAudio.volume = 0.5;
    notificationAudio.load(); // Preload the audio
    audioInitialized = true;
  } catch (error) {
    console.log("Could not initialize audio");
  }
}

export function playNotificationSound() {
  console.log("🔔 Playing notification sound..."); // Debug log
  try {
    if (!notificationAudio) {
      notificationAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
      notificationAudio.volume = 0.5;
    }
    notificationAudio.currentTime = 0;
    notificationAudio.play()
      .then(() => console.log("✅ Sound played successfully"))
      .catch((e) => console.log("❌ Sound blocked by browser:", e.message));
  } catch (error) {
    console.log("Could not play notification sound:", error);
  }
}

export function formatLastSeen(date) {
  if (!date) return "";
  
  const now = new Date();
  const lastSeen = new Date(date);
  const diffMs = now - lastSeen;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Last seen just now";
  if (diffMins < 60) return `Last seen ${diffMins} min ago`;
  if (diffHours < 24) return `Last seen ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Last seen yesterday";
  if (diffDays < 7) return `Last seen ${diffDays} days ago`;
  
  return `Last seen ${lastSeen.toLocaleDateString()}`;
}


