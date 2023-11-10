// fetchApi.js
document.addEventListener('DOMContentLoaded', () => {
    const brandDropdown = document.getElementById('makeup-brand');
    const typeDropdown = document.getElementById('makeup-type');
    const searchButton = document.getElementById('searchButton');

    // Fetch available brands and populate the brand dropdown
    async function fetchMakeupBrands() {
        try {
            const response = await fetch('https://makeup-api.herokuapp.com/api/v1/products.json');
            const data = await response.json();

            const uniqueBrands = [...new Set(data.map(product => product.brand))];
            displayDropdownOptions(brandDropdown, uniqueBrands);

            // Fetch product types for the initial brand
            const initialBrand = uniqueBrands[0];
            fetchProductTypes(initialBrand);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    }

    // Fetch product types and populate the type dropdown
    async function fetchProductTypes(brand) {
        try {
            const response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`);
            const data = await response.json();

            const productTypes = getUniqueValues(data, 'product_type');
            displayDropdownOptions(typeDropdown, productTypes);
        } catch (error) {
            console.error('Error fetching product types:', error);
        }
    }

    // Fetch and display makeup products based on the selected brand and product type
    async function getMakeupProducts(brand, productType) {
        try {
            const response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}&product_type=${productType}`);
            const data = await response.json();

            displayMakeupDetails(data);
        } catch (error) {
            console.error('Error fetching makeup products:', error);
        }
    }

    // Event listener for the Search button
    searchButton.addEventListener('click', () => {
        const selectedBrand = brandDropdown.value;
        const selectedType = typeDropdown.value;
        getMakeupProducts(selectedBrand, selectedType);
    });

    // Event listener for brand dropdown change
    brandDropdown.addEventListener('change', () => {
        const selectedBrand = brandDropdown.value;
        fetchProductTypes(selectedBrand);
    });

    // Fetch available brands when the page loads
    fetchMakeupBrands();
});

// Utility function to get unique values from an array of objects
function getUniqueValues(data, key) {
    return [...new Set(data.map(item => item[key]))];
}

// Utility function to display dropdown options
function displayDropdownOptions(dropdown, options) {
    dropdown.innerHTML = '';

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
    });
}

// Utility function to display makeup product details
function displayMakeupDetails(data) {
    const makeupDetailsDiv = document.getElementById('makeupDetails');
    makeupDetailsDiv.innerHTML = '';

    data.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('makeup-product');

        const img = document.createElement('img');
        img.src = product.image_link;
        img.loading = 'lazy';

        const productName = document.createElement('h2');
        productName.textContent = product.name;

        const productBrand = document.createElement('h4');
        productBrand.textContent = 'Brand: ' + product.brand;

        const productPrice = document.createElement('div');
        productPrice.textContent = 'Price: $' + product.price;

        const productDescription = document.createElement('h5');
        productDescription.textContent = 'Description: ' + product.description;

        const productType = document.createElement('h3');
        productType.textContent = 'Type: ' + product.product_type;

        const productLink = document.createElement('a');
        productLink.href = product.product_link;
        productLink.textContent = 'Product Link';
        productLink.target = '_blank';
        
        const addButton = document.createElement('button');
        addButton.textContent = 'Add to List';
        addButton.addEventListener('click', () => {
            addToUserList(product);
        });

        productDiv.appendChild(img);
        productDiv.appendChild(productName);
        productDiv.appendChild(productBrand);
        productDiv.appendChild(productPrice);
        productDiv.appendChild(productDescription);
        productDiv.appendChild(productType);
        productDiv.appendChild(productLink);
        productDiv.appendChild(addButton);

        makeupDetailsDiv.appendChild(productDiv);

        const separator = document.createElement('hr');
        makeupDetailsDiv.appendChild(separator);
    });
}

// Utility function to add the selected product to the user's list
function addToUserList(product) {
    const userMakeupList = getUserMakeupList();

    // Check if the product is already in the list
    const isProductInList = userMakeupList.some(item => item.name === product.name);

    if (userMakeupList.length >= 5) {
        alert('You can\'t add more than 5 products to your list.');
    } else if (!isProductInList) {
        // Add the product to the list
        userMakeupList.push(product);

        // Update the user's list in localStorage
        localStorage.setItem('userMakeupList', JSON.stringify(userMakeupList));
        alert('Product added to list');
    } else {
        alert('Product already in the list.');
    }
}


// Utility function to retrieve the user's makeup list from localStorage
function getUserMakeupList() {
    const storedList = localStorage.getItem('userMakeupList');
    return storedList ? JSON.parse(storedList) : [];
}
