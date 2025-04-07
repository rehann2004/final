document.addEventListener('DOMContentLoaded', function() {
  const coreSubjectsForm = document.getElementById('coreSubjectsForm');
  const electivesForm = document.getElementById('electivesForm');
  const completeRegistrationBtn = document.getElementById('completeRegistrationBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const messageDiv = document.getElementById('dashboardMessage');
  
  // Core subjects checkboxes
  const computerNetwork = document.getElementById('computerNetwork');
  const cloudComputing = document.getElementById('cloudComputing');
  const nlp = document.getElementById('nlp');
  const cnLab = document.getElementById('cnLab');
  const minorProject = document.getElementById('minorProject');
  const palr = document.getElementById('palr');
  
  // Elective subjects checkboxes
  const embeddedSystem = document.getElementById('embeddedSystem');
  const blockchainLedgers = document.getElementById('blockchainLedgers');
  const computationalMedicine = document.getElementById('computationalMedicine');
  const edgeComputing = document.getElementById('edgeComputing');
  const securityOperations = document.getElementById('securityOperations');
  
  // Status elements
  const coreStatusValue = document.getElementById('coreStatusValue');
  const electiveStatusValue = document.getElementById('electiveStatusValue');
  const registrationStatusValue = document.getElementById('registrationStatusValue');
  
  // Check auth status and load user selections
  checkAuthAndLoadSelections();
  
  function checkAuthAndLoadSelections() {
    fetch('/api/auth/check')
      .then(response => response.json())
      .then(data => {
        if (!data.isAuthenticated) {
          window.location.href = '/index.html';
          return;
        }
        
        // Load user selections
        loadUserSelections();
      })
      .catch(error => {
        console.error('Error checking auth status:', error);
        showMessage('An error occurred. Please try again.', 'error');
      });
  }
  
  function loadUserSelections() {
    fetch('/api/courses/selections')
      .then(response => response.json())
      .then(data => {
        // Set core subjects checkboxes
        const core = data.coreSubjects;
        computerNetwork.checked = core.computerNetwork;
        cloudComputing.checked = core.cloudComputing;
        nlp.checked = core.nlp;
        cnLab.checked = core.cnLab;
        minorProject.checked = core.minorProject;
        palr.checked = core.palr;
        
        // Set electives checkboxes
        const electives = data.electives;
        embeddedSystem.checked = electives.embeddedSystem;
        blockchainLedgers.checked = electives.blockchainLedgers;
        computationalMedicine.checked = electives.computationalMedicine;
        edgeComputing.checked = electives.edgeComputing;
        securityOperations.checked = electives.securityOperations;
        
        // Update status indicators
        updateStatusIndicators(core, electives, data.registrationComplete);
      })
      .catch(error => {
        console.error('Error loading user selections:', error);
        showMessage('An error occurred while loading your selections.', 'error');
      });
  }
  
  // Update status indicators based on current selections
  function updateStatusIndicators(core, electives, registrationComplete) {
    // Check if all core subjects are selected
    const allCoresSelected = 
      core.computerNetwork && 
      core.cloudComputing && 
      core.nlp && 
      core.cnLab && 
      core.minorProject && 
      core.palr;
    
    // Count selected electives
    const selectedElectives = 
      (electives.embeddedSystem ? 1 : 0) + 
      (electives.blockchainLedgers ? 1 : 0) + 
      (electives.computationalMedicine ? 1 : 0) + 
      (electives.edgeComputing ? 1 : 0) + 
      (electives.securityOperations ? 1 : 0);
    
    // Update core status
    if (allCoresSelected) {
      coreStatusValue.textContent = 'Complete';
      coreStatusValue.className = 'status-value status-complete';
    } else {
      coreStatusValue.textContent = 'Not Complete';
      coreStatusValue.className = 'status-value status-incomplete';
    }
    
    // Update elective status
    if (selectedElectives === 2) {
      electiveStatusValue.textContent = 'Complete';
      electiveStatusValue.className = 'status-value status-complete';
    } else {
      electiveStatusValue.textContent = `Not Complete (${selectedElectives}/2)`;
      electiveStatusValue.className = 'status-value status-incomplete';
    }
    
    // Update registration status
    if (registrationComplete) {
      registrationStatusValue.textContent = 'Complete';
      registrationStatusValue.className = 'status-value status-complete';
    } else {
      registrationStatusValue.textContent = 'Not Complete';
      registrationStatusValue.className = 'status-value status-incomplete';
    }
  }
  
  // Handle core subjects form submission
  coreSubjectsForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const coreData = {
      computerNetwork: computerNetwork.checked,
      cloudComputing: cloudComputing.checked,
      nlp: nlp.checked,
      cnLab: cnLab.checked,
      minorProject: minorProject.checked,
      palr: palr.checked
    };
    
    fetch('/api/courses/core', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(coreData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.msg === 'Core subjects updated') {
        showMessage('Core subjects saved successfully!', 'success');
        loadUserSelections();
      } else {
        showMessage(data.msg, 'error');
      }
    })
    .catch(error => {
      console.error('Error saving core subjects:', error);
      showMessage('An error occurred. Please try again.', 'error');
    });
  });
  
  // Handle electives form submission
  electivesForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const electivesData = {
      embeddedSystem: embeddedSystem.checked,
      blockchainLedgers: blockchainLedgers.checked,
      computationalMedicine: computationalMedicine.checked,
      edgeComputing: edgeComputing.checked,
      securityOperations: securityOperations.checked
    };
    
    fetch('/api/courses/electives', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(electivesData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.msg === 'Electives updated') {
        showMessage('Elective subjects saved successfully!', 'success');
        loadUserSelections();
      } else {
        showMessage(data.msg, 'error');
      }
    })
    .catch(error => {
      console.error('Error saving electives:', error);
      showMessage('An error occurred. Please try again.', 'error');
    });
  });
  
  // Handle complete registration button click
  completeRegistrationBtn.addEventListener('click', function() {
    fetch('/api/courses/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.msg === 'Registration completed successfully') {
        showMessage('Registration completed successfully!', 'success');
        loadUserSelections();
      } else {
        showMessage(data.msg, 'error');
      }
    })
    .catch(error => {
      console.error('Error completing registration:', error);
      showMessage('An error occurred. Please try again.', 'error');
    });
  });
  
  // Handle logout button click
  logoutBtn.addEventListener('click', function() {
    fetch('/api/auth/logout', {
      method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
      if (data.msg === 'Logged out successfully') {
        window.location.href = '/index.html';
      } else {
        showMessage(data.msg, 'error');
      }
    })
    .catch(error => {
      console.error('Error logging out:', error);
      showMessage('An error occurred. Please try again.', 'error');
    });
  });
  
  // Limit elective selections to exactly 2
  const electiveCheckboxes = [embeddedSystem, blockchainLedgers, computationalMedicine, edgeComputing, securityOperations];
  
  electiveCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const selectedCount = electiveCheckboxes.filter(cb => cb.checked).length;
      
      if (selectedCount > 2) {
        this.checked = false;
        showMessage('You can only select 2 electives.', 'error');
      }
    });
  });
  
  // Display message
  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    
    // Clear message after 5 seconds
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = 'message';
    }, 5000);
  }
});
