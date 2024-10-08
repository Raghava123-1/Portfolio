document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalContent = document.getElementById('terminal-content');
    const infoDisplay = document.getElementById('info-display'); 
    terminalInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const inputValue = terminalInput.value.trim();
            if (inputValue) {
                handleCommand(inputValue);
                terminalInput.value = '';
            }
        }
    });
    const texts = ["Cyber Security Student", "MERN Stack Developer","Ethical Hacker"];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';
    let isDeleting = false;
    
    function type() {
        
        currentText = texts[count];
        if (!isDeleting) {
            letter = currentText.slice(0, ++index); 
        } else {
            letter = currentText.slice(0, --index); 
        }
    
        document.getElementById('dynamic-text').textContent = letter;
    
        if (!isDeleting && letter.length === currentText.length) {
            setTimeout(() => isDeleting = true, 1500); 
        } 
        else if (isDeleting && letter.length === 0) {
            isDeleting = false; 
            count = (count + 1) % texts.length; 
        }
        const typingSpeed = isDeleting ? 100 : 150;
        setTimeout(type, typingSpeed); 
    }
    window.onload = () => {
        setTimeout(type, 500); 
    };
    
    const handleCommand = (command) => {
        const response = getResponse(command);
        terminalContent.innerHTML += `<div><span class="prompt">raghava@portfolio:~$</span> ${command}</div>`;
        terminalContent.innerHTML += `<div>${response}</div>`;
        terminalContent.scrollTop = terminalContent.scrollHeight;
        setTimeout(() => {
            infoDisplay.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    };

    const getResponse = (command) => {
        switch (command) {
            case '1':
                return displayAboutInfo();
            case '2':
                return displayCertificationInfo();
            case '3':
                return displayEducationInfo();  
            case '4':
                return showProjects();
            case '5':
                return displaySkillsInfo();
            case '6':
                return displayRolesAndResponsibilities();
            default:
                return 'Command not recognized. Please enter a number between 1 and 7.';
        }
    };

    const displayAboutInfo = () => {
        infoDisplay.innerHTML = `
      <div class="about-container">
        <div class="about-content">
          <h2>About Me</h2>
            <p>Hello! I am a dedicated and ambitious Computer Science student currently pursuing my BTech at VNRVJIET, with an expected graduation in 2026. My primary interest lies in the field of Cyber Security, where I am driven by a passion for ethical hacking and protecting systems against cyber threats.</p>
            <p>I thrive on solving complex security challenges and am continuously expanding my knowledge and skills in this ever-evolving field. My coursework and projects have equipped me with a strong foundation in various aspects of computer science and cyber security, including:</p>
            <ul>
                <li>Network Security</li>
                <li>Penetration Testing</li>
                <li>Cryptography</li>
                <li>Ethical Hacking</li>
                <li>Security Protocols</li>
            </ul>
            <p>I am always eager to learn and explore new technologies, participate in hackathons, and collaborate on innovative projects. My goal is to contribute to a safer digital world by leveraging my skills and knowledge in cyber security.</p>
            <p>Feel free to connect with me for discussions on cyber security, collaboration opportunities, or simply to network!</p>
        </div>
        <div class="photo-container">
          <img src="../assests/Photo3.jpg" alt="Photo" class="about-photo" />
        </div>
      </div>
    `;
        return 'Detailed information displayed below.';
    };

    const displayCertificationInfo = () => {
        const certifications = [
            { name: 'Google Cybersecurity Professional Certificate', url: 'https://drive.google.com/file/d/1mkEw4c8RDvFoPO9WwfgUOQPfFfc7sDB-/view?usp=sharing' },
            { name: 'Smart Interviews Phase 1', url: 'https://drive.google.com/file/d/1Fxe-DALmdpNUBneqogNcUqJX5E-OpGfm/view?usp=sharing' },
            { name: 'Tata Group Cybersecurity Analyst Completion Certificate', url: 'https://drive.google.com/file/d/1D71Yih3fUKD_yb5D8bhZ4mdWMxf13EiA/view?usp=sharing' },
            { name: 'CDAC - Pragmatic Approach to Cyber Security', url: 'https://drive.google.com/file/d/1AEqqndEuFD8qK2WxawSH__kxPLRvivU4/view?usp=sharing' },
            { name: 'Google AI Essentials', url: 'https://www.credly.com/badges/590868e7-5c3c-4099-bfd7-62191ff301c5/public_url' },
            { name: 'Nexus Elites CTF 2024', url: 'https://drive.google.com/file/d/180RZjabL_te5KU_ZwJ4yZJK3fWbOl2_u/view?usp=sharing' },
            { name: 'Cyber Suraksha - Tata Strive & Microsoft', url: 'https://drive.google.com/file/d/1TUFiqH-sIwWLMODO63HMQ6E98sWVODxb/view?usp=sharing' },
        ];

        infoDisplay.innerHTML = '<h2>Certifications</h2>';
        certifications.forEach(cert => {
            const certElement = document.createElement('div');
            certElement.innerHTML = `<span class="certification-link" data-url="${cert.url}">${cert.name}</span>`;
            infoDisplay.appendChild(certElement);

            certElement.querySelector('.certification-link').addEventListener('click', (event) => {
                window.open(event.target.dataset.url, '_blank');
            });
        });

        return 'Detailed information displayed below.';
    };

    const displayEducationInfo = () => {
        infoDisplay.innerHTML = `
            <h2>Education Details</h2>
            <div class="education-info">
                <div class="education-item">
                    <span class="icon1">&#x1F393;</span> <strong>School:</strong> EXCELLENT E/M HIGH SCHOOL, MANUGURU
                </div>
                <div class="education-item">
                    <span class="icon1">&#x1F4C8;</span> <strong>Grade:</strong> 10
                </div>
                <div class="education-item">
                    <span class="icon1">&#x1F393;</span> <strong>Intermediate:</strong> NARAYANA JR COLLEGE, VIJAYAWADA
                </div>
                <div class="education-item">
                    <span class="icon1">&#x1F4C8;</span> <strong>Percentage:</strong> 97.6%
                </div>
                <div class="education-item">
                    <span class="icon1">&#x1F393;</span> <strong>B.Tech:</strong> VNR VJIET, HYDERABAD
                </div>
                <div class="education-item">
                    <span class="icon1">&#x1F4C8;</span> <strong>Branch:</strong> CSE - Cyber Security
                </div>
                <div class="education-item">
                    <span class="icon1">&#x1F4C8;</span> <strong>Year:</strong> 3rd Year
                </div>
                <div class="education-item">
                    <span class="icon1">&#x1F4C8;</span> <strong>CGPA:</strong> 9.38
                </div>
            </div>
        `;
        infoDisplay.style.display = 'block'; 
        return 'Education details displayed below.';
    };



    const showProjects = () => {
        infoDisplay.innerHTML = `
            <div class="projects-container">
                <div class="project-card">
                    <h3>Smart Agro - Weather Alert Website</h3>
                    <p>Website which sends alerts to farmers by call and notifications on bad weather 24 hours in advance.</p>
                </div>
                <div class="project-card">
                    <h3>Secured QR Generator</h3>
                    <p>Step-authentication type of security for QR codes.</p>
                </div>
                <div class="project-card">
                    <h3>Fields2Fork-App (under development)</h3>
                    <p>A mobile app for direct market access for farmers, connecting them with consumers and retailers to manage transactions.</p>
                </div>
            </div>
            <div class="coming-soon">
                <p>Cyber Security projects will be displayed soon...</p>
            </div>`;
        
        infoDisplay.style.display = 'block'; 
        return 'Projects details displayed below.';
    };
    

    const displaySkillsInfo = () => {
        infoDisplay.innerHTML = `
            <h2 class="skills-heading">Skills</h2>
            <div class="skills-section">
                <div class="skills-category">
                    <h3 class="category-heading">Scripting Languages</h3>
                    <div class="skills-icons">
                        <img src="../icons/html5-logo-240.png" alt="HTML" title="HTML" class="icon">
                        <img src="../icons/css3-logo-240.png" alt="CSS" title="CSS" class="icon">
                        <img src="../icons/bootstrap-logo-240.png" alt="Bootstrap" title="Bootstrap" class="icon">
                    </div>
                </div>
                <div class="skills-category">
                    <h3 class="category-heading">Frameworks</h3>
                    <div class="skills-icons">
                        <img src="../icons/flask-logo-240.png" alt="Flask" title="Flask" class="icon">
                        <img src="../icons/icons8-express-js-480.png" alt="Express.js" title="Express.js" class="icon">
                        <img src="icons/react-logo-240.png" alt="React.js" title="React.js" class="icon">
                        <img src="../icons/nodejs-logo-240.png" alt="Node.js" title="Node.js" class="icon">
                    </div>
                </div>
                <div class="skills-category">
                    <h3 class="category-heading">Programming Languages</h3>
                    <div class="skills-icons">
                        <img src="icons/letter-c.png" alt="C" title="C" class="icon">
                        <img src="icons/c-plus-plus-logo-240.png" alt="C++" title="C++" class="icon">
                        <img src="icons/python-logo-240.png" alt="Python" title="Python" class="icon">
                        <img src="../icons/javascript-logo-240.png" alt="JavaScript" title="JavaScript" class="icon">
                        <img src="icons/java-logo-240.png" alt="Java" title="Java" class="icon">
                    </div>
                </div>
                <div class="skills-category">
                    <h3 class="category-heading">Databases</h3>
                    <div class="skills-icons">
                        <img src="icons/sql (1).png" alt="SQL" title="SQL" class="icon">
                    </div>
                </div>
                <div class="skills-category">
                    <h3 class="category-heading">Version Control</h3>
                    <div class="skills-icons">
                        <img src="icons/git-logo-240.png" alt="Git" title="Git" class="icon">
                        <img src="icons/github-logo-240.png" alt="GitHub" title="GitHub" class="icon">
                    </div>
                </div>
                <div class="skills-category">
                    <h3 class="category-heading">Operating Systems</h3>
                    <div class="skills-icons">
                        <img src="icons/icons8-windows-250.png" alt="Windows 11" title="Windows 11" class="icon">
                        <img src="icons/windows-logo-240.png" alt="Windows 10" title="Windows 10" class="icon">
                        <img src="icons/icons8-kali-linux-240.png" alt="Kali" title="Kali" class="icon">
                        <img src="icons/linux.png" alt="Linux" title="Linux" class="icon">
                    </div>
                </div>
            </div>
        `;
        return 'Skills information displayed below.';
    };

    const displayRolesAndResponsibilities = () => {
        infoDisplay.innerHTML = `
            <h2>Roles & Responsibilities</h2>
            <ul>
                <li>1. Vice President in the College Cyber Security Club "Garuda Vigilance"</li>
                <li>2. Volunteer in NSS Club</li>
                <li>3. Member in Cyber Secured India Group</li>
                <li>4. Member in R3X CTF Group</li>
            </ul>
        `;
        return 'Roles and responsibilities information displayed below.';
    };
    
    
    const video = document.getElementById('openingVideo');
    const skipButton = document.getElementById('skipButton');
    const mainContent = document.getElementById('mainContent');
    const videoContainer = document.querySelector('.video-container');
    
    video.playbackRate = 3.5;
    
    function showMainContent() {
        videoContainer.classList.add('fade-out');
        
        setTimeout(() => {
            videoContainer.style.display = 'none';
            mainContent.style.display = 'block';
        }, 1000); 
    }
    video.addEventListener('ended', showMainContent);
    skipButton.addEventListener('click', showMainContent);
    
    
    
});
