import React, { useState, useEffect } from 'react';

function Disperse() {
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState(null);
  const [inputText, setInputText] = useState('');
  const [duplicateOption, setDuplicateOption] = useState(null);

  // Update inputText whenever addresses change
  useEffect(() => {
    setInputText(
      addresses
        .map((addressObj) => `${addressObj.address} ${addressObj.amount}`)
        .join('\n')
    );
  }, [addresses]);

  // Validate and process the user's input
  const onSubmit = () => {
    const lines = inputText.split('\n');
    const validatedAddresses = [];
    const duplicateAddresses = new Map(); // Use a Map to store duplicates along with their line numbers
    const errors = [];
  
    for (const [index, line] of lines.entries()) {
      const parts = line.trim().split(/[\s,=]+/);
  
      const [address, amount] = parts;
  
      const addressRegex = /0x[0-9a-fA-F]{40}$/;
      if (!address.match(addressRegex)) {
        errors.push(`Invalid address on line ${index + 1}`);
        setError(`Invalid address on line ${index + 1}`);
        return;
      } else if (isNaN(amount)) {
        errors.push(`Line ${index + 1} has an invalid amount`);
        setError(`Line ${index + 1} has an invalid amount`);
        return;
      } else if (validatedAddresses.some((item) => item.address === address)) {
        if (!duplicateAddresses.has(address)) {
          duplicateAddresses.set(address, [validatedAddresses.findIndex(item => item.address === address) + 1]);
        }
        duplicateAddresses.get(address).push(index + 1);
      }
  
      validatedAddresses.push({ address, amount: parseFloat(amount) });
    }
  
    setAddresses(validatedAddresses);
    setError(null);
  
    if (duplicateAddresses.size > 0) {
      // If duplicates found, set the duplicateOption state to prompt the user for action
      duplicateAddresses.forEach((lineNumbers, address) => {
        errors.push(`Address ${address} encountered duplicate in Line: ${lineNumbers.join(', ')}`);
      });
      setDuplicateOption('Duplicated');
    }
  
    // Join errors with line breaks and set as the error message
    setError(errors.join('\n'));
  };
  
  
  

  // Function to handle keeping the first occurrence of duplicate addresses
  const keepFirstOne = () => {
    const uniqueAddresses = [];
    const encounteredAddresses = new Set();

    for (const addressObj of addresses) {
      const { address } = addressObj;
      if (!encounteredAddresses.has(address)) {
        uniqueAddresses.push(addressObj);
        encounteredAddresses.add(address);
      }
    }

    setAddresses(uniqueAddresses);
    setDuplicateOption(null);
  };

  // Function to handle combining balances of duplicate addresses
  const combineBalances = () => {
    const addressMap = new Map();

    for (const addressObj of addresses) {
      const { address, amount } = addressObj;
      if (addressMap.has(address)) {
        addressMap.set(address, addressMap.get(address) + amount);
      } else {
        addressMap.set(address, amount);
      }
    }

    const combinedAddresses = [];
    for (const [address, amount] of addressMap) {
      combinedAddresses.push({ address, amount });
    }

    setAddresses(combinedAddresses);
    setDuplicateOption(null);
  };

  return (
    <div>
      <h1>Disperse Component</h1>

      {/* Input field for addresses */}
      <div className='address'>
        <div>Addresses with Amounts</div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter addresses with amounts (e.g., 0x2CB99F193549681e06C6770dDD5543812B4FaFE8 10)"
          rows={15}
          cols={85}
        />
        <div>Separated by ',' or ' ' or '='</div>
        
        {/* Display options if duplicate addresses are found */}
        {duplicateOption && (
            <div className='duplicate'>
                <div>{duplicateOption}</div>
                <div>
                    <a onClick={keepFirstOne}>Keep the first one</a>
                    &ensp;|&ensp;
                    <a onClick={combineBalances}>Combine Balance</a>
                </div>
            </div>
        )}
        {
            error && <div className='error'>
                <div>
                    <svg width="20px" height="22px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#f50000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 " stroke="none" fill-rule="evenodd" fill="#f92f43"></path></g></svg>
                </div>
                <div><pre>{error}</pre></div>
            </div>
        }

        
        {/* Button to submit the input */}
        <button onClick={onSubmit}>Next</button>
      </div>


      
    </div>
  );
}

export default Disperse;
