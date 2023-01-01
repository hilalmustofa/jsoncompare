import React, { useState, useEffect } from "react";
import deepDiff from 'deep-diff';

const App = () => {
  const [baseValue, setBaseValue] = useState('');
  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [base, setBase] = useState({});
  const [first, setFirst] = useState({});
  const [second, setSecond] = useState({});
  const [diff1, setDiff1] = useState(null);
  const [diff2, setDiff2] = useState(null);
  const [baseName, setBaseName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [baseError, setBaseError] = useState('');
  const [firstError, setFirstError] = useState('');
  const [secondError, setSecondError] = useState('');

  useEffect(() => {
    setDiff1(deepDiff.diff(base, first));
    setDiff2(deepDiff.diff(first, second));
  }, [base, first, second]);

  const handleSubmit = () => {
    try {
      setBase(JSON.parse(baseValue));
      setBaseError(null);
    } catch (error) {
      setBaseError('Invalid JSON chef, ngowar lu');

    }

    try {
      setFirst(JSON.parse(firstValue));
      setFirstError(null);
    } catch (error) {
      setFirstError('Invalid JSON chef, ngowar lu');
    }

    try {
      setSecond(JSON.parse(secondValue));
      setSecondError(null);
    } catch (error) {
      setSecondError('Invalid JSON chef, ngowar lu');
    }
  };


  const highlightChangedValues = (value, diff) => {
    let result = '<pre>';
    let jsonString = JSON.stringify(value, null, 2);
    if (diff) {
      for (const key of Object.keys(value)) {
        const changedValue = diff.find(item => item.path[0] === key);
        if (changedValue) {
          const path = changedValue.path.join('.');
          jsonString = jsonString.replace(new RegExp(`"${path}":\\s*"([^"]*)"`, 'g'), '<span class="changed">$&</span>');
          jsonString = jsonString.replace(new RegExp(`"${path}":\\s*{`, 'g'), '<span class="changed">$&</span>{');
          jsonString = jsonString.replace(new RegExp(`"${path}":\\s*\\[`, 'g'), '<span class="changed">$&</span>[');
          jsonString = jsonString.replace(new RegExp(`"${path}":\\s*\\b([^"]*)\\b`, 'g'), '<span class="changed">$&</span>');
        }
      }
    }

    // Split the JSON string into an array of lines
    const lines = jsonString.split('\n');

    // Add line numbering to each line
    for (let i = 0; i < lines.length; i++) {
      result += `<span class="line-number">${i + 1}</span> ${lines[i]}\n`;
    }

    result += '</pre>';
    return result;
  };




  return (
    <div>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "5px" }}>
          <img src={require("./assets/comparejson.png")} style={{ height: "40px" }} alt="logo" />
        </div>
        <h1 class="title is-5 has-text-centered">Multiple JSON diff checker</h1>
        <h2 class="subtitle is-6 has-text-centered">Compare multiple json objects and find the differences</h2>
        <div className="columns">
          <div className="column">
            <input className="input has-text-centered" type="text" value={baseName} onChange={e => setBaseName(e.target.value)} placeholder="Enter a name" />
            <textarea className="textarea" value={baseValue} onChange={e => setBaseValue(e.target.value)} placeholder="JSON goes here chef" rows="5" resize="both" style={{ fontSize: "14px" }} />
          </div>
          <div className="column">
            <input className="input has-text-centered" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Enter a name" />
            <textarea className="textarea" value={firstValue} onChange={e => setFirstValue(e.target.value)} placeholder="JSON goes here chef" rows="5" resize="both" style={{ fontSize: "14px" }} />
          </div>
          <div className="column">
            <input className="input has-text-centered" type="text" value={secondName} onChange={e => setSecondName(e.target.value)} placeholder="Enter a name" />
            <textarea className="textarea" value={secondValue} onChange={e => setSecondValue(e.target.value)} placeholder="JSON goes here chef" rows="5" resize="both" style={{ fontSize: "14px" }} />
          </div>
        </div>
        <br />
        <div className="has-text-centered">
          <button className="button is-success" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <div className="columns">
          <div className="column">
            <h3 className="title is-5 has-text-centered">{baseName}</h3>
            {baseError && <p className="has-text-danger has-text-centered">{baseError}</p>}
            {!baseError && <div dangerouslySetInnerHTML={{ __html: highlightChangedValues(base) }} />}
          </div>
          <div className="column">
            <h3 className="title is-5 has-text-centered">{firstName}</h3>
            {firstError && <p className="has-text-danger has-text-centered">{firstError}</p>}
            {!firstError && <div dangerouslySetInnerHTML={{ __html: highlightChangedValues(first, diff1) }} />}
          </div>
          <div className="column">
            <h3 className="title is-5 has-text-centered">{secondName}</h3>
            {secondError && <p className="has-text-danger has-text-centered">{secondError}</p>}
            {!secondError && <div dangerouslySetInnerHTML={{ __html: highlightChangedValues(second, diff2) }} />}
          </div>
        </div>
      </div>

  <div class="content has-text-centered" style={{ position: "fixed", bottom: 10, left:10}}>
    <p>
      QA Tool created by <a href="https://github.com/hilalmustofa">mzhll</a> @2023
    </p>
  </div>



    </div>
  );

};

export default App;