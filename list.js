document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display the user's top 5 makeup list
    displayUserMakeupList();
});

function displayUserMakeupList() {
    const userMakeupList = getUserMakeupList(); // Assuming you have a function to get the user's makeup list

    const userMakeupListElement = document.getElementById('userMakeupList');

    // Clear existing list content
    userMakeupListElement.innerHTML = '';

    // Display each item in the user's makeup list
    userMakeupList.forEach(item => {
        const tableRow = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name; // Customize this based on your item structure
        tableRow.appendChild(nameCell);

        const brandCell = document.createElement('td');
        brandCell.textContent = item.brand; // Customize this based on your item structure
        tableRow.appendChild(brandCell);

        const removeButtonCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeFromUserList(item);
        });
        removeButtonCell.appendChild(removeButton);
        tableRow.appendChild(removeButtonCell);

        userMakeupListElement.appendChild(tableRow);
    });
}
// Function to remove the selected product from the user's list
function removeFromUserList(selectedProduct) {
    const userMakeupList = getUserMakeupList();

    // Find the index of the selected item
    const selectedIndex = userMakeupList.findIndex(product => product.name === selectedProduct.name);

    // Confirm with the user before removing
    const confirmation = confirm(`Are you sure you want to remove ${selectedProduct.name} from your list?`);

    if (confirmation) {
        // Remove the item from the list
        if (selectedIndex !== -1) {
            userMakeupList.splice(selectedIndex, 1);
        }

        // Update the user's list in localStorage
        localStorage.setItem('userMakeupList', JSON.stringify(userMakeupList));

        // Refresh the displayed list
        displayUserMakeupList();
    }
}

// Function to get the user's makeup list from local storage
function getUserMakeupList() {
    const userMakeupList = localStorage.getItem('userMakeupList');
    return userMakeupList ? JSON.parse(userMakeupList) : [];
}

