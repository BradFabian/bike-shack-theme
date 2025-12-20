//logic for our custom contact form
const businessForm = document.querySelector("#businessAccount");
const companyInfo = document.querySelector("#companyInfo");
const reasonInput = document.querySelector("#contactReason");
const productField = document.querySelector('#productNameField');
const orderNumField = document.querySelector('#orderNumberField');


document.addEventListener('DOMContentLoaded', function() {

businessForm.addEventListener('change', (event) => {
    // The 'event.target.checked' property is a boolean (true or false)
    if (event.target.checked) {
         companyInfo.classList.remove('hidden');

        console.log('Checkbox is checked.');
       
    } else {
        companyInfo.classList.add('hidden');

        console.log('Checkbox is not checked.');
        
    }

    
});

});

reasonInput.addEventListener('change', (event) => {
  const value = event.target.value;

  // Always reset state
  productField.classList.add('hidden');
  orderNumField.classList.add('hidden');

  switch (value) {
    case 'product':
      productField.classList.remove('hidden');
      break;

    case 'order':
      orderNumField.classList.remove('hidden');

      break;

    default:
      // nothing to show
      break;
  }
});