import React, { useState, useEffect } from 'react';
import './App.css';
import { forwardRef } from 'react';

import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const api = axios.create({
  baseURL: `http://localhost:8000/api`
})

function LearningOutcome({selcourse}) {

  var columns = [
    {title: "id", field: "id", hidden: true},
    {title: "course_id", field: "course_id", hidden: true},
    {title: "Description", field: "description"},
    {
      title: "Graduate Attribute",
      field: "gradAttribute",
      lookup:
       {
         1:"A1. A knowledge base for engineering",
         2:"A2. Problem analysis",
         3:"A3. Investigation",
         4:"A4. Design",
         5:"A5. Use of enigeineering tools",
         6:"A6. Individual and team work",
         7:"A7. Communication skills",
         8:"A8. Professionalism",
         9:"A9. Impact of engineering on society/environment",
         10:"A10. Ethics and equality",
         11:"A11. Economics and project management",
         12:"A12. Life-long learning"
       } 
    },
    {
      title: "Instruction Level",
      field: "instLevel",
      lookup:
       {
         1:"A (Applied)",
         2:"I (Introduced)",
         3:"D (Developed)"
       } 
    }
  ]
  const [data, setData] = useState([]); //table data

  //for error handling
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  useEffect(() => { 
    refresh()
  }, [])

  const refresh = () => {
    // update data
    api.get("/learningOutcomes?course_id=" + selcourse)
        .then(res => {               
            setData(res.data)
         })
         .catch(error=>{
             console.log("Error")
         })
  }

  const handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    let errorList = []
    if(newData.description === ""){
      errorList.push("Please enter description")
    }
    if(newData.gradAttribute === ""){
      errorList.push("Please enter graduate attribute")
    }
    if(newData.instLevel === ""){
      errorList.push("Please enter instruction level")
    }

    if(errorList.length < 1){
      api.put("/learningOutcomes/" + newData.id + "/", newData)
      .then(res => {
        refresh()
        resolve()
        setIserror(false)
        setErrorMessages([])
      })
      .catch(error => {
        setErrorMessages(["Update failed! Server error"])
        setIserror(true)
        resolve()
        
      })
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()

    }
    
  }

  const handleRowAdd = (newData, resolve) => {
    //validation
    let errorList = []
    if(newData.description === undefined){
      errorList.push("Please enter description")
    }
    if(newData.gradAttribute === undefined){
      errorList.push("Please enter graduate attribute")
    }
    if(newData.instLevel === undefined){
      errorList.push("Please enter instruction level")
    }

    let learningOutcomeData = {
      course_id: selcourse,
      description: newData.description,
      gradAttribute: newData.gradAttribute,
      instLevel: newData.instLevel,
    }

    if(errorList.length < 1){ //no error
      api.post("/learningOutcomes/", learningOutcomeData)
      .then(res => {

        refresh()
        resolve()
        setErrorMessages([])
        setIserror(false)
      })
      .catch(error => {
        setErrorMessages(["Cannot add data. Server error!"])
        setIserror(true)
        resolve()
      })
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }

    
  }

  const handleRowDelete = (oldData, resolve) => {
    
    api.delete("/learningOutcomes/" + oldData.id + "/")
      .then(res => {
        refresh()

        resolve()
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }


  return (
    
    <div className="LearningOutcome">
      <div>
        {iserror && 
          <Alert severity="error">
              {errorMessages.map((msg, i) => {
                  return <div key={i}>{msg}</div>
              })}
          </Alert>
        }       
      </div>

      <MaterialTable
        title="List of Learning Outcomes"
        columns={columns}
        data={data}
        icons={tableIcons}
        editable={{

          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
                handleRowUpdate(newData, oldData, resolve);
                
            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve)
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRowDelete(oldData, resolve)
            }),
        }}
        options={{
          search: false,
          selection: false,
          showSelectAllCheckbox: false,
          showTitle: false,
        }}
      />
    </div>
  );
}

export default LearningOutcome;