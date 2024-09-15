const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const mainSection = document.querySelector('.main');

let tasks = [];
let personality = 'friendly';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Function to speak text
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.volume = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

// Wish user based on the time of day
function wishMe() {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
        speak("Good Morning Boss...");
    } else if (currentHour >= 12 && currentHour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

// Fetch weather data
function getWeather(city) {
    const apiKey = "your-api-key";  // Replace with your API key
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const temp = data.main.temp;
            const description = data.weather[0].description;
            speak(`The temperature in ${city} is ${temp} degrees Celsius with ${description}.`);
        })
        .catch(() => speak("Sorry, I couldn't retrieve the weather information."));
}

// Task reminder feature
function rememberTask(task) {
    tasks.push(task);
    speak("Task added to your list.");
}

// Check for tasks to remind every minute
setInterval(() => {
    const now = new Date();
    tasks.forEach((task, index) => {
        if (new Date(task.time).getTime() <= now.getTime()) {
            speak(`Reminder: ${task.name}`);
            tasks.splice(index, 1); // Remove the task after reminding
        }
    });
}, 60000);

// Set alarm feature
function setAlarm(time) {
    const alarmTime = new Date();
    const [hours, minutes] = time.split(':');
    alarmTime.setHours(hours, minutes, 0, 0);

    speak(`Alarm set for ${time}`);
    setTimeout(() => {
        speak("Time's up! Here's your alarm.");
    }, alarmTime.getTime() - Date.now());
}

// Change assistant personality
function setPersonality(type) {
    if (type === 'funny') {
        speak('Get ready for some jokes and puns!');
    } else if (type === 'professional') {
        speak('I will now respond in a more formal tone.');
    } else {
        speak('I will keep things friendly and casual.');
    }
    personality = type;
}

// Voice command recognition
recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
    content.textContent = transcript;
    takeCommand(transcript);
};

// Start listening when button is clicked
btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    mainSection.classList.add('listening');
    recognition.start();

    // Remove 'listening' class after 1.5 seconds
    setTimeout(() => {
        mainSection.classList.remove('listening');
    }, 1500);
});

// Handle various voice commands
function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes("open instagram")) {
        window.open("https://www.instagram.com", "_blank");
        speak("Opening Instagram...");
    } else if (message.includes("open amazon")) {
        window.open("https://www.amazon.in", "_blank");
        speak("Opening Amazon...");
    } else if (message.includes("open chatgpt")) {
        window.open("https://chatgpt.com", "_blank");
        speak("Opening ChatGPT...");
    } else if (message.includes("call appa")) {
        const phoneNumber = "8867658988";
        window.open(`tel:${phoneNumber}`);
        speak("Calling Appa...");
    } else if (message.includes('weather in')) {
        const city = message.split('weather in')[1].trim();
        getWeather(city);
    } else if (message.includes('set alarm for')) {
        const time = message.split('set alarm for')[1].trim();
        setAlarm(time);
    } else if (message.includes('change personality to')) {
        const type = message.split('change personality to')[1].trim();
        setPersonality(type);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        speak(`The current time is ${time}`);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
        speak(`Today's date is ${date}`);
    } else if (message.includes('open whatsapp')) {
        window.open("https://wa.me/", "_blank");
        speak("Opening WhatsApp...");
    } else if (message.includes('open spotify')) {
        window.open("https://open.spotify.com", "_blank");
        speak("Opening Spotify...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speak(`This is what I found on the internet regarding ${message}`);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        speak(`This is what I found on Wikipedia regarding ${message}`);
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speak(`I found some information on Google for ${message}`);
    }
}

// Initial setup when page loads
window.addEventListener('load', () => {
    speak("Initializing AADAM...");
    wishMe();
});
