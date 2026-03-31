const corsOptions = {
  // Use an array if you want to allow both local dev and production/mobile origins
  origin: [
    "http://localhost:3000", // Your current local dev
    "http://localhost:8100", // Default Ionic dev port
    "http://localhost:8101", // Default Ionic dev port
    "capacitor://localhost", // Ionic iOS
    "http://localhost", // Ionic Android
    "http://[IP_ADDRESS]", // Ionic Android
  ],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true, // Set to true if you plan on using cookies/sessions
};

module.exports = corsOptions;
