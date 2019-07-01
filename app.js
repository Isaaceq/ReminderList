// Reminder Class: Represents a reminder
class Reminder {
  constructor(title, date, note) {
    this.title = title;
    this.date = date;
    this.note = note;
  }
}

// UI Class: Handle UI Tasks
class UI {  
  static displayReminder() {
    const reminder = Store.getReminder();

    reminder.forEach(reminder => UI.addReminderToList(reminder));
  }

  static addReminderToList(reminder) {
    const list = document.querySelector('#reminder-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${reminder.title}</td>
      <td>${reminder.date}</td>
      <td>${reminder.note}</td>
      <td><a href="#" class="btn btn-sm far fa-trash-alt delete"></a></td>
      `;

      list.appendChild(row);
  }

  static deleteReminder(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove()
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.col');
    const form = document.querySelector('#reminder-form');
    container.insertBefore(div, form)

    // Remove in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#date').value = '';
    document.querySelector('#note').value = '';
  }
}

// Store Class Handles Storage
class Store {
  static getReminder(){
    let reminders;
    if (localStorage.getItem('reminders') === null) {
      reminders = [];
    } else {
      reminders = JSON.parse(localStorage.getItem('reminders'));
    }
    return reminders;
  }

  static addReminder(reminder) {
    const reminders = Store.getReminder();
    reminders.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }

  static removeReminder(title) {
    const reminders = Store.getReminder();
    reminders.forEach((reminder, index) => {
      if (reminder.title !== title) {
        reminders.splice(index, 1);
      }
    });
    localStorage.setItem('reminders', JSON.stringify(reminders))
  }
}

// Event: Display Reminder
document.addEventListener('DOMContentLoaded', UI.displayReminder);

// Event: Add a Reminder
document.querySelector('#reminder-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();
  // Get form values
  const title = document.querySelector('#title').value;
  const date = document.querySelector('#date').value;
  const note = document.querySelector('#note').value;

  // Validate
  if (title === '' || date === '' || note === '') {
      UI.showAlert('PLease fill in all fields', 'danger')
  } else {
    //Instantiate reminder
    const reminder = new Reminder(title, date, note);

    // Add reminder to UI
    UI.addReminderToList(reminder);

    // Add reminder to store
    Store.addReminder(reminder)

    // Show success message
    UI.showAlert('Reminder Added', 'success')

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Reminder
document.querySelector('#reminder-list').addEventListener('click', (e) => {

  // Remove reminder from UI
  UI.deleteReminder(e.target);

  // Remove reminder from store
  Store.removeReminder(e.target.parentElement.previousElementSibling.textContent);

  // Show delete message
  UI.showAlert('Reminder Removed', 'success')
});