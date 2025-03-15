const API_URL = 'https://my-json-server.typicode.com/Migelangel04/Personal-Website/db';
let localButton = document.getElementById('local-load');
let remoteButton = document.getElementById('remote-load');
let projectsContainer = document.querySelector('.projects-container');

class ProjectCard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <div>
        <slot></slot>
      </div>
    ` 
  }
}

class ProjectDetails extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <div>
        <slot></slot>
      </div>
    ` 
  }
}
customElements.define('project-card', ProjectCard);
customElements.define('project-details', ProjectDetails);

localButton.addEventListener('click', () => {
  try {
    const projectsData = localStorage.getItem('projects');
    let projects;
    if (projectsData) {
      projects = JSON.parse(projectsData);
    } else {
      fetch('./localStorage.json')
        .then(response => response.json())
        .then(importedData => {
          projects = importedData.projects;
          localStorage.setItem('projects', JSON.stringify(projects));
        });
    }
    projectsContainer.innerHTML = "";
    projects.forEach((project) => {
      addProject(project); 
    })

  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return null;
  }
})

remoteButton.addEventListener('click', () => {
  fetch(API_URL)
  .then(response => {
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the JSON from the response
    return response.json();
  })
  .then(data => {
    // Log the data to console
    console.log('Data received:', typeof(data.projects));
    projectsContainer.innerHTML = ""
    data.projects.forEach((project) => {
     addProject(project); 
    })
  })
  .catch(error => {
    // Handle any errors that occur during the fetch
    console.error('Fetch error:', error);
  });
})


function addProject(project) {
  const card = document.createElement('project-card');
  const picture = document.createElement('picture');
  const img = document.createElement('img');
  const detailsContainer = document.createElement('project-details');

  // Complete the Image Element
  img.src = project.image;
  img.alt = project.imageAlt;
  picture.appendChild(img);

  //Heading
  let heading = document.createElement('h2');
  heading.textContent = project.title;
  detailsContainer.appendChild(heading);

  // Description
  let description = document.createElement('p');
  let desHeader = document.createElement('strong');
  desHeader.textContent = "Description: ";
  description.appendChild(desHeader);
  description.textContent += project.description;
  detailsContainer.appendChild(description)

  //Technologies Header
  let techHeader = document.createElement('p');
  let techHeaderText = document.createElement('strong');
  techHeaderText.textContent = "Technologies:";
  techHeader.appendChild(techHeaderText)
  detailsContainer.appendChild(techHeader)

  //Tech List
  let techList = document.createElement('ul');
  project.technologies.forEach((tech) => {
    let item = document.createElement('li');
    item.textContent = tech;
    techList.appendChild(item);
  })
  detailsContainer.appendChild(techList);

  //Links
  let links = document.createElement('div');
  let demo = document.createElement('a');
  let source = document.createElement('a');
  
  demo.href = project.demoLink;
  demo.classList.add('project-links');
  demo.textContent = "Demo"
  if (project.demoDisabled) {
    demo.classList.add('disabled-demo');
  }

  source.href = project.sourceLink;
  source.classList.add('project-links');
  source.textContent = "Source Code";
  
  links.appendChild(demo);
  links.appendChild(source);
  detailsContainer.appendChild(links)

  //Wrap everything up
  card.appendChild(picture);
  card.appendChild(detailsContainer)
  projectsContainer.append(card);
}

document.addEventListener('DOMContentLoaded', () => {
    let contactForm = document.getElementById('contact');
    let name = document.getElementById('name');
    let nameError = document.getElementById('error-name');
    let email = document.getElementById('email');
    let emailError = document.getElementById('error-email');
    let message = document.getElementById('message');
    let messageError = document.getElementById('error-message');
    let messageCharCount = document.getElementById('char-count');
    let possibleBot = document.getElementById('possible_bot');
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      toggle.checked = true;
    }

    toggle.addEventListener('change', function() {
      if (this.checked) {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      }
    });

    message.addEventListener('input', () => {
        const length = message.value.length
        messageCharCount.textContent = length
        
        if (length === 500) {
            messageCharCount.style.color = 'red'
        } else if (length > 400) {
            messageCharCount.style.color = 'orange'
        } else {
            messageCharCount.style.color = ''
        }
    })

    contactForm.addEventListener('input', () => {
        possibleBot.value = "false";
    });

    contactForm.addEventListener('submit', (event) => {
        // Check if the form is valid
        let isValid = true;
        
        // Validate each field individually
        if (!validateName(name)) isValid = false;
        if (!validateEmail(email)) isValid = false;
        if (!validateMessage(message)) isValid = false;
        
        // Bot detection - check if user interacted with form naturally
        if (possibleBot.value === "true") {
          possibleBot.value = "false";
        }
        
        // If not valid, prevent submission
        if (!isValid) {
          event.preventDefault();
        }
    });

    name.addEventListener('input', () => {
        validateName(name);
    });
    
      // Custom validation for email
    email.addEventListener('input', () => {
        validateEmail(email);
    });
    
      // Custom validation for message
    message.addEventListener('input', () => {
        validateMessage(message);
    });

    function validateName(input) {
        const nameRegex = /^[A-Za-z\s\-']+$/;
        const minLength = parseInt(input.getAttribute('minlength'));
        const maxLength = parseInt(input.getAttribute('maxlength'));
        const value = input.value.trim();
        console.log(value)
        
        // Reset custom validity
        input.setCustomValidity('');
        nameError.textContent = '';
        
        // Check if empty
        if (value === '') {
            input.setCustomValidity('Please enter your name');
            nameError.textContent = 'Name is required';
            return false;
        }
        // Check length
        else if (value.length < minLength) {
            input.setCustomValidity(`Name must be at least ${minLength} characters`);
            nameError.textContent = `Name must be at least ${minLength} characters`;
            return false;
        }
        else if (value.length > maxLength) {
            input.setCustomValidity(`Name must be less than ${maxLength} characters`);
            nameError.textContent = `Name must be less than ${maxLength} characters`;
            return false;
        }
        // Check pattern
        else if (!nameRegex.test(value)) {
            input.setCustomValidity('Name should contain only letters, spaces, hyphens or apostrophes');
            nameError.textContent = 'Please use only letters, spaces, hyphens or apostrophes';
            return false;
        }
        
        return input.checkValidity();
    }

    function validateEmail(input) {
        const value = input.value.trim();
        emailError.textContent = '';
        input.setCustomValidity('');
        
        // Check if empty
        if (value === '') {
          input.setCustomValidity('Please enter your email address');
          emailError.textContent = 'Email is required';
          return false;
        }
        // The pattern attribute handles the email format validation
        else if (!input.checkValidity()) {
          input.setCustomValidity('Please enter a valid email address');
          emailError.textContent = 'Please enter a valid email address';
          return false;
        }
        
        return true;
    }

    function validateMessage(input) {
        const value = input.value.trim();
        const minLength = parseInt(input.getAttribute('minlength'));
        const maxLength = parseInt(input.getAttribute('maxlength'));
        messageError.textContent = '';
        input.setCustomValidity('');
        
        // Check if empty
        if (value === '') {
          input.setCustomValidity('Please enter a message');
          messageError.textContent = 'Message is required';
          return false;
        }
        // Check length
        else if (value.length < minLength) {
          input.setCustomValidity(`Message must be at least ${minLength} characters`);
          messageError.textContent = `Message must be at least ${minLength} characters`;
          return false;
        }
        else if (value.length > maxLength) {
          input.setCustomValidity(`Message must be less than ${maxLength} characters`);
          messageError.textContent = `Message exceeds maximum length of ${maxLength} characters`;
          return false;
        }
        
        return true;
    }

        
})
    
