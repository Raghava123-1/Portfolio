document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalContent = document.getElementById('terminal-content');
    const infoDisplay = document.getElementById('info-display');  // Ensure this is correct

    terminalInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const inputValue = terminalInput.value.trim();
            if (inputValue) {
                handleCommand(inputValue);
                terminalInput.value = '';
            }
        }
    });

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
                return displayEducationInfo();  // Properly linked
            case '4':
                return 'Displaying projects and documentations...';
            case '5':
                return 'Displaying skills information...';
            case '6':
                return 'Displaying achievements information...';
            case '7':
                return 'Displaying roles and responsibilities information...';
            default:
                return 'Command not recognized. Please enter a number between 1 and 7.';
        }
    };

    const displayAboutInfo = () => {
        infoDisplay.innerHTML = `
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
        `;
        return 'Detailed information displayed below.';
    };

    const displayCertificationInfo = () => {
        const certifications = [
            { name: 'Google Cybersecurity Professional Certificate', url: 'https://drive.google.com/file/d/1mkEw4c8RDvFoPO9WwfgUOQPfFfc7sDB-/view?usp=sharing' },
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
                    <span class="icon">&#x1F393;</span> <strong>School:</strong> EXCELLENT E/M HIGH SCHOOL, MANUGURU
                </div>
                <div class="education-item">
                    <span class="icon">&#x1F4C8;</span> <strong>Grade:</strong> 10
                </div>
                <div class="education-item">
                    <span class="icon">&#x1F393;</span> <strong>Intermediate:</strong> NARAYANA JR COLLEGE, VIJAYAWADA
                </div>
                <div class="education-item">
                    <span class="icon">&#x1F4C8;</span> <strong>Percentage:</strong> 97.6%
                </div>
                <div class="education-item">
                    <span class="icon">&#x1F393;</span> <strong>B.Tech:</strong> VNR VJIET, HYDERABAD
                </div>
                <div class="education-item">
                    <span class="icon">&#x1F4C8;</span> <strong>Branch:</strong> CSE - Cyber Security
                </div>
                <div class="education-item">
                    <span class="icon">&#x1F4C8;</span> <strong>Year:</strong> 3rd Year
                </div>
                <div class="education-item">
                    <span class="icon">&#x1F4C8;</span> <strong>CGPA:</strong> 9.38
                </div>
            </div>
        `;
        infoDisplay.style.display = 'block'; // Display info
        return 'Education details displayed below.';
    };
});
