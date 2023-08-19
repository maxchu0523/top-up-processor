const fs = require("fs");

// Read the JSON files
const companies = JSON.parse(fs.readFileSync("companies.json", "utf8"));
const users = JSON.parse(fs.readFileSync("users.json", "utf8"));


// Validate the data
if (!Array.isArray(companies) || !Array.isArray(users)) {
  console.error("Invalid data format");
  process.exit(1);
}

// Validate company data
if (!companies.every(validateCompany)) {
  console.error("Invalid company data");
  process.exit(1);
}

// Validate user data
if (!users.every(validateUser)) {
  console.error("Invalid user data");
  process.exit(1);
}

// Sort companies by ID
companies.sort((a, b) => a.id - b.id);

// Sort users alphabetically by last name
users.sort((a, b) => a.last_name.localeCompare(b.last_name));

// Process data and generate output
let output = "";

companies.forEach((company) => {
  output += `Company Id: ${company.id}\nCompany Name: ${company.name}\nUsers Emailed:\n`;

  let emailedUsers = [];
  let notEmailedUsers = [];
  users.forEach((user) => {
    if (user.company_id === company.id) {
      if (user.email_status) {
        emailedUsers.push(user);
      } else {
        notEmailedUsers.push(user);
      }
    }
  });

  output += createUsersTopRecords(emailedUsers, company);

  output += `Users Not Emailed:\n`;

  output += createUsersTopRecords(notEmailedUsers, company);

  output += `Total amount of top ups for ${company.name}: ${
    company.top_up * (notEmailedUsers.length + emailedUsers.length)
  }\n\n`;
});

// Write the output to a file
fs.writeFileSync("output.txt", output, "utf8");

console.log("Output generated successfully.");

// Function to create the user top up record
function createUsersTopRecords(users, company) {
  let output = "";

  users.forEach((user) => {
    output += `\t${user.last_name}, ${user.first_name}, ${user.email}\n`;
    output += `\t  Previous Token Balance, ${user.tokens}\n`;
    output += `\t  New Token Balance ${user.tokens + company.top_up}\n`;
  });

  return output;
}

// Function to validate company data
function validateCompany(company) {
  return (
    typeof company === 'object' &&
    company !== null &&
    company.hasOwnProperty('id') &&
    company.hasOwnProperty('name') &&
    company.hasOwnProperty('top_up') &&
    company.hasOwnProperty('email_status') &&
    typeof company.id === 'number' &&
    typeof company.name === 'string' &&
    typeof company.top_up === 'number' &&
    typeof company.email_status === 'boolean' &&
    company.id !== null &&
    company.name.trim() !== '' // Check for non-empty name
  );
}

// Function to validate user data
function validateUser(user) {
  return (
    typeof user === "object" &&
    user !== null &&
    user.hasOwnProperty("id") &&
    user.hasOwnProperty("first_name") &&
    user.hasOwnProperty("last_name") &&
    user.hasOwnProperty("email") &&
    user.hasOwnProperty("company_id") &&
    user.hasOwnProperty("email_status") &&
    user.hasOwnProperty("active_status") &&
    user.hasOwnProperty("tokens") &&
    typeof user.id === "number" &&
    typeof user.first_name === "string" &&
    typeof user.last_name === "string" &&
    typeof user.email === "string" &&
    typeof user.company_id === "number" &&
    typeof user.email_status === "boolean" &&
    typeof user.active_status === "boolean" &&
    typeof user.tokens === "number" &&
    user.id !== null &&
    user.first_name.trim() !== '' && // Check for non-empty first name
    user.last_name.trim() !== '' &&  // Check for non-empty last name
    user.email.trim() !== '' && // Check for non-empty email
    validateCompanyId(user.company_id) &&
    validateEmail(user.email)
  );
}


// Function to validate company id exists in companies array
function validateCompanyId (companyId) {
  return companies.some(company => company.id === companyId);
}

// Function to validate email format
function validateEmail(email) {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return pattern.test(email);
}
