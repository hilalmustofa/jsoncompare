import React, { useState, useEffect, useRef } from 'react';
import deepDiff from 'deep-diff';

function App() {
  const [baseValue, setBaseValue] = useState('');
  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [base, setBase] = useState('');
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [baseName, setBaseName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [diffs, setDiffs] = useState([]);
  const [diffs2, setDiffs2] = useState([]);
  const [highlightedJson, setHighlightedJson] = useState('');
  const [highlightedJson2, setHighlightedJson2] = useState('');
  const [baseError, setBaseError] = useState('');
  const [firstError, setFirstError] = useState('');
  const [secondError, setSecondError] = useState('');



  useEffect(() => {
    try {
      if (base && first) {
        const diff1 = deepDiff(base, first);
        setDiffs(diff1)
      }
    } catch (error) {
      console.error(error)
      setBaseError('Error occurred while comparing base and first JSONs');
    }

    try {
      if (first && second) {
        const diff2 = deepDiff(first, second);
        setDiffs2(diff2)
      }
    } catch (error) {
      console.error(error)
      setFirstError('Error occurred while comparing first and second JSONs');
    }

  }, [base, first, second])

  useEffect(() => {
    if (Array.isArray(diffs)) {
      diffs.forEach(diff => {
        if (diff.kind === 'E') {
          let path = diff.path;
          let value = diff.rhs;
          let obj = first;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          obj[path[0]] = `<span style='background-color:pink'>${value}</span>`;
        } else if (diff.kind === 'D') {
          let path = diff.path;
          let value = diff.lhs;
          let obj = first;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          let key = path[0];
          delete obj[key];
          obj[`<del>${key}</del>`] = `<del>${value}</del>`;
        } else if (diff.kind === 'A') {
          let path = diff.path;
          let index = diff.index;
          let value = diff.item.rhs;
          let obj = first;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          obj[path[0]].splice(index, 0, `<span style='background-color:green'>${value}</span>`);
        } else if (diff.kind === 'N') {
          let path = diff.path;
          let value = diff.rhs;
          let obj = first;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          obj[path[0]] = `<span style='background-color:cyan'>${value}</span>`;
        }
      });

      let highlightedJson = JSON.stringify(first, null, 2);
      highlightedJson = highlightedJson.replace(/,/g, ",");
      let lineNumber = 1;
      highlightedJson = highlightedJson.replace(/^(.*)$/gm, (p1) => `<span class="line-number">${lineNumber++} </span>${p1}`);
      setHighlightedJson(highlightedJson);
    } else if (typeof diffs === 'object') {
      // Handle case where objects are completely different
      setHighlightedJson('Objects are completely different');
    }
  }, [diffs, first]);


  useEffect(() => {
    if (Array.isArray(diffs2)) {
      diffs2.forEach(diff => {
        if (diff.kind === 'E') {
          let path = diff.path;
          let value = diff.rhs;
          let obj = second;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          obj[path[0]] = `<span style='background-color:pink'>${value}</span>`;
        } else if (diff.kind === 'D') {
          let path = diff.path;
          let value = diff.lhs;
          let obj = second;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          let key = path[0];
          delete obj[key];
          obj[`<del>${key}</del>`] = `<del>${value}</del>`;
        } else if (diff.kind === 'A') {
          let path = diff.path;
          let index = diff.index;
          let value = diff.item.rhs;
          let obj = second;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          obj[path[0]].splice(index, 0, `<span style='background-color:green'>${value}</span>`);
        } else if (diff.kind === 'N') {
          let path = diff.path;
          let value = diff.rhs;
          let obj = second;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          obj[path[0]] = `<span style='background-color:cyan'>${value}</span>`;
        }
      });

      let highlightedJson2 = JSON.stringify(second, null, 2);
      highlightedJson2 = highlightedJson2.replace(/,/g, ",");
      let lineNumber = 1;
      highlightedJson2 = highlightedJson2.replace(/^(.*)$/gm, (p1) => `<span class="line-number">${lineNumber++} </span>${p1}`);
      setHighlightedJson2(highlightedJson2);
    } else if (typeof diffs2 === 'object') {
      // Handle case where objects are completely different
      setHighlightedJson('Objects are completely different');
    }
  }, [diffs2, second]);

  let dasar = JSON.stringify(base, null, 2);
  dasar = dasar.replace(/,/g, "");
  let lineNumber = 1;
  dasar = dasar.replace(/^(.*)$/gm, (p1) => `<span class="line-number">${lineNumber++} </span>${p1}`);



  const columnRef = useRef(null);
  const handleSubmit = () => {
    if (baseValue === '') {
      setBaseError('JSON is empty');
    } else {
      try {
        setBase(JSON.parse(baseValue));
        setBaseError(null);
      } catch (error) {
        setBaseError('Invalid JSON chef, ngowar lu');

      }
    }
    if (firstValue === '') {
      setFirstError('JSON is empty');
    } else {
      try {
        setFirst(JSON.parse(firstValue));
        setFirstError(null);
      } catch (error) {
        setFirstError('Invalid JSON chef, ngowar lu');
      }
    }
    if (secondValue === '') {
      setSecondError('JSON is empty');
    } else {
      try {
        setSecond(JSON.parse(secondValue));
        setSecondError(null);
      } catch (error) {
        setSecondError('Invalid JSON chef, ngowar lu');
      }
    }

    if (baseValue !== '' && firstValue !== '' && baseValue === firstValue) {
      setFirstError('Json are identical chef')
    } if (firstValue !== '' && secondValue !== '' && firstValue === secondValue) {
      setSecondError('Json are identical chef')
    }
    if (firstValue !== '' && secondValue !== '' && baseValue === secondValue) {
      setSecondError('Json are identical chef')
    }
    const button = document.querySelector('.button');
    button.classList.add('animate__animated', 'animate__hinge');

    setTimeout(() => {
      window.scrollTo({
        top: columnRef.current.offsetTop,
        behavior: 'smooth'
      });
    }, 600);

    setTimeout(() => {
      button.classList.remove('animate__animated', 'animate__hinge');
      button.classList.add('animate__animated', 'animate__fadeInDown', 'animate-delay', '1s');
    }, 5000);
  }


  return (
    <div>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "5px" }}>
          <img src={require("./assets/comparejson.png")} style={{ height: "40px" }} className="animate__animated animate__bounceInDown" alt="logo" />
        </div>
        <h1 class="title is-5 has-text-centered animate__animated animate__fadeInDown">Multiple JSON diff checker</h1>
        <h2 class="subtitle is-6 has-text-centered animate__animated animate__fadeInUp">Compare multiple json objects and find the differences</h2>
        <div className="columns animate__animated animate__fadeIn animate__slow">
          <div className="column">
            <input className="input has-text-centered" type="text" value={baseName} onChange={e => setBaseName(e.target.value)} placeholder="Enter a name" />
            <textarea className="textarea" value={baseValue} onChange={e => setBaseValue(e.target.value)} placeholder="JSON goes here chef" rows="15" resize="both" style={{ fontSize: "14px" }} />
          </div>
          <div className="column">
            <input className="input has-text-centered" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Enter a name" />
            <textarea className="textarea" value={firstValue} onChange={e => setFirstValue(e.target.value)} placeholder="JSON goes here chef" rows="15" resize="both" style={{ fontSize: "14px" }} />
          </div>
          <div className="column">
            <input className="input has-text-centered" type="text" value={secondName} onChange={e => setSecondName(e.target.value)} placeholder="Enter a name" />
            <textarea className="textarea" value={secondValue} onChange={e => setSecondValue(e.target.value)} placeholder="JSON goes here chef" rows="15" resize="both" style={{ fontSize: "14px" }} />
          </div>
        </div>
        <br />
        <div className="has-text-centered animate__animated animate__zoomInDown">
          <button className="button is-success animate__animated animate__swing animate__delay-1.9s" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <div className="columns is-centered">
          <div ref={columnRef} className="column">
            <h3 className="title is-5 has-text-centered">{baseName}</h3>
            {baseError && <p className="has-text-danger has-text-centered animate__animated animate__fadeIn">{baseError}</p>}
            {!baseError && <pre dangerouslySetInnerHTML={{ __html: dasar }} />}
          </div>
          <div className="column">
            <h3 className="title is-5 has-text-centered">{firstName}</h3>
            {firstError && <p className="has-text-danger has-text-centered animate__animated animate__fadeIn">{firstError}</p>}
            {!firstError && <pre dangerouslySetInnerHTML={{ __html: highlightedJson }} />}
          </div>
          <div className="column">
            <h3 className="title is-5 has-text-centered">{secondName}</h3>
            {secondError && <p className="has-text-danger has-text-centered animate__animated animate__fadeIn">{secondError}</p>}
            {!secondError && <pre dangerouslySetInnerHTML={{ __html: highlightedJson2 }} />}
          </div>
        </div>
      </div>
      <div class="content is-small" style={{ position: "relative", marginBottom: 10, marginTop:30, left: 10 }}>
        <p>
          QA Tool created by <a href="https://github.com/hilalmustofa">mzhll</a> @2023
        </p>
      </div>
    </div>
  );
}



export default App;