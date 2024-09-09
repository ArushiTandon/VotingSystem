function handleEvent(event) {
    event.preventDefault();

    // User Details
    const votingDetails = {
        Name: event.target.username.value,
        Candidate: event.target.monitor.value,
    };

    // Post the vote
    axios
        .post(`https://crudcrud.com/api/c2f15ed22d9b4cf89647d41ea57ac70f/votingData`, votingDetails)
        .then((response) => {
            display(response.data);
            incrementVoteCount(response.data.Candidate);
            clearForm();
            updateTotalVotes();
        })
        .catch((err) => {
            console.log(err);
        });
}

function loadUser() {
    axios
        .get(`https://crudcrud.com/api/c2f15ed22d9b4cf89647d41ea57ac70f/votingData`)
        .then((response) => {
            const voterList = document.querySelector("ul");
            voterList.innerHTML = "";

            // Initialize candidate votes
            const candidateVotes = {
                Suresh: 0,
                Deepank: 0,
                Abhik: 0,
            };

            response.data.forEach((user) => {
                display(user);

                // Increment candidate votes from the fetched data
                candidateVotes[user.Candidate]++;
            });

            // Update each candidate's vote count
            updateCandidateVotesUI(candidateVotes);
            updateTotalVotes();
        })
        .catch((err) => {
            console.log(err);
        });
}

// Function to display data on screen
function display(user) {
    
    const candidateContainer = document.getElementById(user.Candidate);

   
    const votesList = candidateContainer.querySelector(".votes-list");

    const voteData = document.createElement("li");
    voteData.textContent = `${user.Name} voted for ${user.Candidate}`;

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
        axios
            .delete(`https://crudcrud.com/api/c2f15ed22d9b4cf89647d41ea57ac70f/votingData/${user._id}`)
            .then(() => {
                voteData.remove();
                decrementVoteCount(user.Candidate);  
                updateTotalVotes();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    voteData.appendChild(deleteBtn);
    votesList.appendChild(voteData);  
}


function updateTotalVotes() {
    axios
        .get(`https://crudcrud.com/api/c2f15ed22d9b4cf89647d41ea57ac70f/votingData`)
        .then((response) => {
            const totalVotes = response.data.length;
            document.querySelector("h5").textContent = `Total Votes: ${totalVotes}`;
        })
        .catch((err) => {
            console.log(err);
        });
}

function incrementVoteCount(candidate) {
    const candidateElement = document.getElementById(candidate);
    let currentVotes = parseInt(candidateElement.querySelector("span").textContent.split(": ")[1]);
    candidateElement.querySelector("span").textContent = `Total: ${currentVotes + 1}`;
}

function decrementVoteCount(candidate) {
    const candidateElement = document.getElementById(candidate);
    let currentVotes = parseInt(candidateElement.querySelector("span").textContent.split(": ")[1]);
    candidateElement.querySelector("span").textContent = `Total: ${currentVotes - 1}`;
}

function updateCandidateVotesUI(candidateVotes) {
    for (const candidate in candidateVotes) {
        const candidateElement = document.getElementById(candidate);
        candidateElement.querySelector("span").textContent = `Total: ${candidateVotes[candidate]}`;
    }
}

function clearForm() {
    document.getElementById("voteForm").reset();
}

// Load votes on page load
window.addEventListener("DOMContentLoaded", loadUser);
