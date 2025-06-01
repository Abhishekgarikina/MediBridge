const users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;

const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");
const bookingSection = document.getElementById("booking-section");

const hospitalSelect = document.getElementById("hospital-select");
const doctorSelect = document.getElementById("doctor-select");
const timeSlotSelect = document.getElementById("time-slot");
const dateInput = document.getElementById("date-input");
const confirmationMessage = document.getElementById("confirmation-message");

const hospitals = {
  "Apollo Hospital": [
    "Dr. Smith (General checkup)", "Dr. Allen (Dermatologist)", "Dr. Kumar (Pediatrician)",
    "Dr. Rao (Orthopedic)", "Dr. Meena (Neurologist)", "Dr. Shankar (ENT)",
    "Dr. Priya (Gynecologist)", "Dr. Das (Oncologist)", "Dr. Reddy (Radiologist)", "Dr. Iyer (Urologist)"
  ],
  "Fortis Hospital": [
    "Dr. Shah (General checkup)", "Dr. Bansal (Orthopedic)", "Dr. Sinha (Psychiatrist)",
    "Dr. Ritu (Cardiologist)", "Dr. Arvind (ENT)", "Dr. Neha (Dermatologist)",
    "Dr. Teja (Gastroenterologist)", "Dr. Naveen (Pulmonologist)", "Dr. Uma (Ophthalmologist)", "Dr. Zafar (Nephrologist)"
  ],
  "AIIMS": [
    "Dr. Vikram (General Physician)", "Dr. Gupta (Oncologist)", "Dr. Swetha (Radiologist)",
    "Dr. Kiran (Cardiologist)", "Dr. Suresh (ENT)", "Dr. Ayesha (Dermatologist)",
    "Dr. Harish (Orthopedic)", "Dr. Namita (Psychiatrist)", "Dr. Devi (Gynecologist)", "Dr. Arora (Pulmonologist)"
  ],
  "Medanta": [
    "Dr. Veer (Cardiologist)", "Dr. Anjali (ENT)", "Dr. Mohan (Urologist)",
    "Dr. Iqbal (Neurologist)", "Dr. Soni (Psychiatrist)", "Dr. Kamal (Dermatologist)",
    "Dr. Rishi (Nephrologist)", "Dr. Savitha (Gynecologist)", "Dr. Ahuja (Radiologist)", "Dr. Bala (Orthopedic)"
  ],
  "Max Hospital": [
    "Dr. Roy (Gynecologist)", "Dr. Gopal (Ophthalmologist)", "Dr. Leena (Endocrinologist)",
    "Dr. Raj (Pulmonologist)", "Dr. Joseph (Nephrologist)", "Dr. Sharma (Dentist)",
    "Dr. Lavanya (Oncologist)", "Dr. Preeti (Cardiologist)", "Dr. Nikhil (ENT)", "Dr. Anand (General Physician)"
  ],
  "Sunshine Hospital": [
    "Dr. Rao (Pulmonologist)", "Dr. Reema (Nephrologist)", "Dr. Kalyan (Dentist)",
    "Dr. Chitra (Oncologist)", "Dr. Vinay (Psychiatrist)", "Dr. Anu (ENT)",
    "Dr. Murthy (Cardiologist)", "Dr. Smita (Radiologist)", "Dr. Ahmed (Orthopedic)", "Dr. Nair (Urologist)"
  ],
  "KIMS": [
    "Dr. Meena (Psychiatrist)", "Dr. Varun (Physiotherapist)", "Dr. Noor (Neurologist)",
    "Dr. Ashok (ENT)", "Dr. Swami (Dermatologist)", "Dr. Fathima (Cardiologist)",
    "Dr. Chinmay (Orthopedic)", "Dr. Geeta (Gynecologist)", "Dr. Vivek (Urologist)", "Dr. Karthik (Radiologist)"
  ],
  "Rainbow Hospital": [
    "Dr. Latha (Pediatrician)", "Dr. Shyam (Surgeon)", "Dr. Kavitha (Cardiologist)",
    "Dr. Jayanth (ENT)", "Dr. Reshma (Gynecologist)", "Dr. Rohit (Neurologist)",
    "Dr. Suhas (Dermatologist)", "Dr. Janaki (Oncologist)", "Dr. Prakash (Pulmonologist)", "Dr. Sandhya (Ophthalmologist)"
  ],
  "Global Hospital": [
    "Dr. Madhu (Oncologist)", "Dr. Ashwin (Orthopedic)", "Dr. Neelam (Dermatologist)",
    "Dr. Kishore (Cardiologist)", "Dr. Bindu (Gynecologist)", "Dr. Vinod (Urologist)",
    "Dr. Usha (Neurologist)", "Dr. Mani (Radiologist)", "Dr. Isha (ENT)", "Dr. Mahesh (General Physician)"
  ]
};

Object.keys(hospitals).forEach(hospital => {
  const option = document.createElement("option");
  option.value = hospital;
  option.textContent = hospital;
  hospitalSelect.appendChild(option);
});

hospitalSelect.addEventListener("change", () => {
  doctorSelect.innerHTML = "";
  const doctors = hospitals[hospitalSelect.value];
  doctors.forEach(doc => {
    const opt = document.createElement("option");
    opt.value = doc;
    opt.textContent = doc;
    doctorSelect.appendChild(opt);
  });
});

hospitalSelect.dispatchEvent(new Event("change"));

const today = new Date().toISOString().split("T")[0];
dateInput.min = today;

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM",
  "11:30 AM", "01:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

timeSlots.forEach(slot => {
  const opt = document.createElement("option");
  opt.value = slot;
  opt.textContent = slot;
  timeSlotSelect.appendChild(opt);
});

// 🟡 NEW CODE: Disable past time slots if today is selected
dateInput.addEventListener("change", () => {
  const selectedDate = dateInput.value;
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // total minutes now

  timeSlotSelect.innerHTML = "";
  timeSlots.forEach(slot => {
    const [time, meridian] = slot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridian === "PM" && hours !== 12) hours += 12;
    if (meridian === "AM" && hours === 12) hours = 0;
    const slotTime = hours * 60 + minutes;

    const opt = document.createElement("option");
    opt.value = slot;
    opt.textContent = slot;

    if (selectedDate === today && slotTime <= currentTime) {
      opt.disabled = true;
    }

    timeSlotSelect.appendChild(opt);
  });
});

function showLogin() {
  loginSection.classList.remove("hidden");
  signupSection.classList.add("hidden");
  bookingSection.classList.add("hidden");
  confirmationMessage.textContent = "";
}
function showSignup() {
  loginSection.classList.add("hidden");
  signupSection.classList.remove("hidden");
  bookingSection.classList.add("hidden");
  confirmationMessage.textContent = "";
}
function showBooking() {
  loginSection.classList.add("hidden");
  signupSection.classList.add("hidden");
  bookingSection.classList.remove("hidden");
  confirmationMessage.textContent = "";
}

document.getElementById("show-signup").onclick = (e) => {
  e.preventDefault();
  showSignup();
};
document.getElementById("show-login").onclick = (e) => {
  e.preventDefault();
  showLogin();
};

document.getElementById("signup-btn").onclick = () => {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const phone = document.getElementById("signup-phone").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!name || !email || !phone || !password) {
    alert("Please fill all signup fields.");
    return;
  }

  if (users.find(u => u.email === email)) {
    alert("Email already registered.");
    return;
  }

  users.push({ name, email, phone, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful! Please login.");
  showLogin();
};

document.getElementById("login-btn").onclick = () => {
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    alert("Invalid login credentials.");
    return;
  }

  currentUser = user;
  showBooking();
};

document.getElementById("book-btn").onclick = () => {
  if (!currentUser) return alert("Please login first.");

  const hospital = hospitalSelect.value;
  const doctor = doctorSelect.value;
  const date = dateInput.value;
  const time = timeSlotSelect.value;

  if (!date) return alert("Please select a date.");

  confirmationMessage.textContent =
    `✅ Appointment confirmed at ${hospital} with ${doctor} on ${date} at ${time}.`;
};

document.getElementById("logout-btn").onclick = () => {
  currentUser = null;
  showLogin();
};
