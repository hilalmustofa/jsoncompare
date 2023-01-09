import React, { useState, useEffect, useRef } from 'react';
import deepDiff from 'deep-diff';
import stringify from 'json-stringify-safe';

function App() {
  const [baseValue, setBaseValue] = useState('');
  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [thirdValue, setThirdValue] = useState('');
  const [base, setBase] = useState('');
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [third, setThird] = useState('');
  const [baseName, setBaseName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [thirdName, setThirdName] = useState('');
  const [diffs, setDiffs] = useState([]);
  const [diffs2, setDiffs2] = useState([]);
  const [diffs3, setDiffs3] = useState([]);
  const [highlightedJson, setHighlightedJson] = useState('');
  const [highlightedJson2, setHighlightedJson2] = useState('');
  const [highlightedJson3, setHighlightedJson3] = useState('');
  const [baseError, setBaseError] = useState('');
  const [firstError, setFirstError] = useState('');
  const [secondError, setSecondError] = useState('');
  const [thirdError, setThirdError] = useState('');

  const columnRef = useRef(null);
  const contentRef = useRef(null);
  const tiboRef = useRef(null);

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

    if (thirdValue === '') {
      setThirdError('JSON is empty');
    } else {
      try {
        setThird(JSON.parse(thirdValue));
        setThirdError(null);
      } catch (error) {
        setThirdError('Invalid JSON chef, ngowar lu');
      }
    }

    if (baseValue !== '' && firstValue !== '' && baseValue === firstValue) {
      setFirstError('Json are identical chef')
    } if (firstValue !== '' && secondValue !== '' && firstValue === secondValue) {
      setSecondError('Json are identical chef')
    } if (secondValue !== '' && thirdValue !== '' && secondValue === thirdValue) {
      setThirdError('Json are identical chef')
    }


    if (baseValue !== '' && secondValue !== '' && baseValue === secondValue) {
      setSecondError('Json are identical chef')
    } if (baseValue !== '' && thirdValue !== '' && baseValue === thirdValue) {
      setThirdError('Json are identical chef')
    }

    const button = document.querySelector('.button');
    button.classList.add('animate__animated', 'animate__hinge');
    setTimeout(() => {
      window.scrollTo({
        top: columnRef.current.offsetTop,
        behavior: 'smooth'
      });
    }, 1300);

    setTimeout(() => {
      button.classList.remove('animate__animated', 'animate__hinge');
      button.classList.add('animate__animated', 'animate__fadeInDown', 'animate-delay', '1s');
    }, 5000);

    contentRef.current.style.display = 'block';
    tiboRef.current.style.display = 'block';
    setTimeout(() => {
      tiboRef.current.style.display = 'none';
    }, 5000);
  }

  useEffect(() => {
    try {
      if (base && first) {
        const diff1 = deepDiff(base, first);
        setDiffs(diff1)
      }
    } catch (error) {
      console.error(error)
      setFirstError('Error occurred while comparing base and first JSONs');
    }
    try {
      if (first && second) {
        const diff2 = deepDiff(first, second);
        setDiffs2(diff2)
      }
    } catch (error) {
      console.error(error)
      setSecondError('Error occurred while comparing first and second JSONs');
    }
    try {
      if (second && third) {
        const diff3 = deepDiff(second, third);
        setDiffs3(diff3)
      }
    } catch (error) {
      console.error(error)
      setThirdError('Error occurred while comparing first and second JSONs');
    }
  }, [base, first, second, third])

  useEffect(() => {
    const Json1 = JSON.parse(stringify(first));
    if (Array.isArray(diffs)) {
      diffs.forEach(diff => {
        if (diff.kind === 'E') {
          let path = diff.path;
          let value = diff.rhs;
          let obj = Json1;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          obj[path[0]] = `<span style='background-color:pink'>${value}</span>`;
        } else if (diff.kind === 'D') {
          let path = diff.path;
          let value = diff.lhs;
          let obj = Json1;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          let key = path[0];
          obj[`<del>${key}</del>`] = `<del>${value}</del>`;
        }
        else if (diff.kind === 'A') {
          let path = diff.path;
          let index = diff.index;
          let value = diff.item.rhs;
          let obj = Json1;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          obj[path[0]].splice(index, 0, `<span style='background-color:green'>${value}</span>`);
        } else if (diff.kind === 'N') {
          let path = diff.path;
          let value = diff.rhs;
          let obj = Json1;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          let key = path[0];
          delete obj[key];
          obj[`<span style='background-color:hsl(150, 70%, 70%)'>${key}</span>`] = `<span style='background-color:hsl(150, 70%, 70%)'>${value}</span>`;
        }
      });

      let highlightedJson = stringify(Json1, null, 2);
      highlightedJson = highlightedJson.replace(/,/g, ",");
      let lineNumber = 1;
      highlightedJson = highlightedJson.replace(/^(.*)$/gm, (p1) => `<span class="line-number">${lineNumber++} </span>${p1}`);
      setHighlightedJson(highlightedJson);
    }
  }, [diffs, first]);

  useEffect(() => {
    const Json2 = JSON.parse(stringify(second));
    if (Array.isArray(diffs2)) {
      diffs2.forEach(diff => {
        if (diff.kind === 'E') {
          let path = diff.path;
          let value = diff.rhs;
          let obj = Json2;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          obj[path[0]] = `<span style='background-color:pink'>${value}</span>`;
        } else if (diff.kind === 'D') {
          let path = diff.path;
          let value = diff.lhs;
          let obj = Json2;
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
          let obj = Json2;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          obj[path[0]].splice(index, 0, `<span style='background-color:green'>${value}</span>`);
        } else if (diff.kind === 'N') {
          let path = diff.path;
          let value = diff.rhs;
          let obj = Json2;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          let key = path[0];
          delete obj[key];
          obj[`<span style='background-color:hsl(150, 70%, 70%)'>${key}</span>`] = `<span style='background-color:hsl(150, 70%, 70%)'>${value}</span>`;
        }
      });

      let highlightedJson2 = stringify(Json2, null, 2);
      highlightedJson2 = highlightedJson2.replace(/,/g, ",");
      let lineNumber = 1;
      highlightedJson2 = highlightedJson2.replace(/^(.*)$/gm, (p1) => `<span class="line-number">${lineNumber++} </span>${p1}`);
      setHighlightedJson2(highlightedJson2);
    }
  }, [diffs2, second]);

  useEffect(() => {
    const Json3 = JSON.parse(stringify(third));
    if (Array.isArray(diffs3)) {
      diffs3.forEach(diff => {
        if (diff.kind === 'E') {
          let path = diff.path;
          let value = diff.rhs;
          let obj = Json3;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          obj[path[0]] = `<span style='background-color:pink'>${value}</span>`;
        } else if (diff.kind === 'D') {
          let path = diff.path;
          let value = diff.lhs;
          let obj = Json3;
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
          let obj = Json3;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          obj[path[0]].splice(index, 0, `<span style='background-color:green'>${value}</span>`);
        } else if (diff.kind === 'N') {
          let path = diff.path;
          let value = diff.rhs;
          let obj = Json3;
          while (path.length > 1) {
            obj = obj[path.shift()];
          }
          let key = path[0];
          delete obj[key];
          obj[`<span style='background-color:hsl(150, 70%, 70%)'>${key}</span>`] = `<span style='background-color:hsl(150, 70%, 70%)'>${value}</span>`;
        }
      });

      let highlightedJson3 = stringify(Json3, null, 2);
      highlightedJson3 = highlightedJson3.replace(/,/g, ",");
      let lineNumber = 1;
      highlightedJson3 = highlightedJson3.replace(/^(.*)$/gm, (p1) => `<span class="line-number">${lineNumber++} </span>${p1}`);
      setHighlightedJson3(highlightedJson3);
    }
  }, [diffs3, third]);

  let dasar = stringify(base, null, 2);
  dasar = dasar.replace(/,/g, "");
  let lineNumber = 1;
  dasar = dasar.replace(/^(.*)$/gm, (p1) => `<span class="line-number">${lineNumber++} </span>${p1}`);

  return (
    <section class="section is-mobile">
      <div class="container is-mobile">
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", marginBottom: "5px" }}>
          <img src={require("./assets/comparejson.png")} style={{ height: "40px" }} className="animate__animated animate__bounceInDown animate__delay-1s" alt="logo" />
        </div>
        <h1 class="title is-5 has-text-centered animate__animated animate__fadeInDown animate__slow">Multiple JSONs diff checker</h1>
        <h2 class="subtitle is-6 has-text-centered animate__animated animate__fadeInUp animate__slow">Compare up to 4 json objects and find the differences</h2>
        <div className="columns is-centered is-multiline animate__animated animate__fadeIn animate__slow">
          <div className="column">
            <input className="input has-text-centered" type="text" value={baseName} onChange={e => setBaseName(e.target.value)} placeholder="Enter a name" />
            <textarea className="textarea" value={baseValue} onChange={e => setBaseValue(e.target.value)} placeholder="JSON goes here chef" rows="15" resize="both" style={{ fontSize: "14px" }} />
          </div>
          <div className="column">
            <input className="input has-text-centered" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Enter a name" />
            <textarea className="textarea" value={firstValue} onChange={e => setFirstValue(e.target.value)} placeholder="JSON goes here chef" rows="15" resize="both" style={{ fontSize: "14px" }} />
          </div>
          {firstValue === "" ? null : (
            <div className="column animate__animated animate__zoomIn animate__faster">
              <input className="input has-text-centered" type="text" value={secondName} onChange={e => setSecondName(e.target.value)} placeholder="Enter a name" />
              <textarea className="textarea" value={secondValue} onChange={e => setSecondValue(e.target.value)} placeholder="JSON goes here chef" rows="15" resize="both" style={{ fontSize: "14px" }} />
            </div>
          )}
          {secondValue === "" ? null : (
            <div className="column animate__animated animate__zoomIn animate__faster">
              <input className="input has-text-centered" type="text" value={thirdName} onChange={e => setThirdName(e.target.value)} placeholder="Enter a name" />
              <textarea className="textarea" value={thirdValue} onChange={e => setThirdValue(e.target.value)} placeholder="JSON goes here chef" rows="15" resize="both" style={{ fontSize: "14px" }} />
            </div>
          )}
        </div>
        <br />
        <div className="has-text-centered animate__animated animate__zoomInDown">
          <button className="button is-success animate__animated animate__swing" onClick={handleSubmit}>
            Compare
          </button>
          <div ref={tiboRef} className="has-text-info-dark animate__animated animate__bounceOutRight animate__delay-1s" style={{ display: "none", position: "absolute", top: "20%", left: "47.2%" }}>
            <p>awokwok <img src={require("./assets/run.png")} style={{ height: "20px" }} alt="running" /></p>
          </div>
        </div>
        <div className="columns is-centered is-multiline">
          <div className="column">
            <h3 className="title is-5 has-text-centered">{baseName}</h3>
          </div>
          <div className="column">
            <h3 className="title is-5 has-text-centered">{firstName}</h3>
          </div>
          {firstValue === "" ? null : (
            <div className="column">
              <h3 className="title is-5 has-text-centered">{secondName}</h3>
            </div>
          )}
          {secondValue === "" ? null : (
            <div className="column">
              <h3 className="title is-5 has-text-centered">{thirdName}</h3>
            </div>
          )}
        </div>
        <div className="columns is-centered is-multiline">
          <div ref={columnRef} className="column">
            {baseError && <p className="has-text-info-dark has-text-centered animate__animated animate__flash animate__repeat-2 animate__slow">{baseError}</p>}
            {!baseError && <pre className="animate__animated animate__fadeIn animate__slow" dangerouslySetInnerHTML={{ __html: dasar }} />}
          </div>
          <div className="column">
            {firstError && <p className="has-text-info-dark has-text-centered animate__animated animate__flash animate__repeat-2 animate__slow">{firstError}</p>}
            {!firstError && <pre className="animate__animated animate__fadeIn animate__slow" dangerouslySetInnerHTML={{ __html: highlightedJson }} />}
          </div>
          {firstValue === "" ? null : (
            <div className="column animate__animated animate__zoomIn animate__faster" >
              {secondError && <p className="has-text-info-dark has-text-centered animate__animated animate__flash animate__repeat-2 animate__slow">{secondError}</p>}
              {!secondError && <pre className="animate__animated animate__fadeIn animate__slow" dangerouslySetInnerHTML={{ __html: highlightedJson2 }} />}
            </div>
          )}
          {secondValue === "" ? null : (
            <div className="column animate__animated animate__zoomIn animate__faster">
              {thirdError && <p className="has-text-info-dark has-text-centered animate__animated animate__flash animate__repeat-2 animate__slow">{thirdError}</p>}
              {!thirdError && <pre className="animate__animated animate__fadeIn animate__slow" dangerouslySetInnerHTML={{ __html: highlightedJson3 }} />}
            </div>
          )}
        </div>
      </div>
      <div ref={contentRef} class="content is-small" style={{ display: 'none', bottom: 0, marginBottom: 10, marginTop: 30, marginLeft: 10 }}>
        <p>
          QA Tool created by <a href="https://github.com/hilalmustofa">mzhll</a> @2023
        </p>
      </div>
    </section>
  );
}

export default App;