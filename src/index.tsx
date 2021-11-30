import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { validate } from "./utils";
import "./index.css";
import { resolveTripleslashReference } from "typescript";

// TODOs:
// - app sends list update  to server but never updates the UI
// - the server is flaky, maybe we need retries
// - missing functionality to add a new item -- and validate it with the new validation function
// - Customer really wants Material UI 

// retrys, function 


const useRetry = (tries = 3, baseWait = 500, increment = 200) => {
  const [error, setError] = useState("")

  const wait = (waitTime: number) => new Promise((res) => setTimeout(res, waitTime))

  const retry = async (callback: any) => {
    let error = true; 
    setError("");
    for(let i = 0; i < tries; i++){
      try{
        await callback();
        error = false;
        break;
      }catch(e){
        const calculatedWaitTime = baseWait + i * increment;      
        console.log(`failed to fetch ${i+1} times. Waiting ${calculatedWaitTime}ms...`)
        await wait(calculatedWaitTime);
      }
    }
    if(error){
      setError("Unable to connect to server. Try again later.")
    }
  }




  return { retry, error };
}

function useList() {
  const [list, setList] = useState<string[]>([]);
  const { retry, error: updateError } = useRetry(3, 500, 200);

  useEffect(() => {
    fetch("/list")
      .then((res) => res.json())
      .then((res) => {
        setList(res);
      });
  }, []);

  const updateList = (newList: string[]) => {

    retry(() => {
      return fetch("/list", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newList),
      }).then((res) => res.json())
        .then(list => setList(list))
    })

  }

  return { list, updateError, updateList };
}

function App() {
  const { list, updateList, updateError } = useList();
  const [newItem, setNewItem] = useState("")
  const [error, setError] = useState("")

  function sendListItemToTop(index: number) {
    updateList([list[index], ...list.filter((_, i) => i !== index)])
  }


  const onNewItemChange = (e: React.FormEvent) => {
    const target = e.target as HTMLInputElement;
    setNewItem(target.value)
  }

  const addItem = () => {
    if (validate(newItem)) {

      updateList([newItem, ...list])
      setNewItem("")
      setError("")
    } else {
      console.log("error")
      setError("Item is not valid")
    }
  }

  return (
    <div>
      

      <div>
        <label htmlFor="temInput">new Item</label>
        <input type="text" id="temInput" value={newItem} onChange={onNewItemChange} />
        <button onClick={addItem}>
          Add
        </button>
      </div>


      <div >
        {updateError || error}
      </div>

      <ul>
        {list.map((text, index) => (
          <li key={index} onClick={() => sendListItemToTop(index)}>{text}</li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
