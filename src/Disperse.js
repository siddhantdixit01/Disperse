import React, { useState, useEffect } from 'react';
import Textarea from './Textarea'; // Import your Textarea component here

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
    const duplicateAddresses = new Map(); 
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
        <Textarea // Replace the textarea with the Textarea component
          value={inputText}
          onValueChange={(value) => setInputText(value)}
          placeholder="Enter addresses with amounts (e.g., 0x2CB99F193549681e06C6770dDD5543812B4FaFE8 10)"
          numOfLines={15}
        />
        <div>Separated by ',' or ' ' or '='</div>

        {/* Display options if duplicate addresses are found */}
        {duplicateOption && (
          <div className='duplicate'>
            <div>{duplicateOption}</div>
            <div className='options'>
              <button onClick={keepFirstOne}>Keep the first one</button>
              &ensp;|&ensp;
              <button onClick={combineBalances}>Combine Balance</button>
            </div>
          </div>
        )}
        {error && (
          <div className='error'>
            <div></div>
            <div>
              <pre>{error}</pre>
            </div>
          </div>
        )}

        {/* Button to submit the input */}
        <button className='next' onClick={onSubmit}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Disperse;
