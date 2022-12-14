import {  connect, useDispatch } from "react-redux";
import { withTranslation } from "react-i18next";
import React, { useEffect } from "react";
import Select from "react-select";
import { getSalesAgentsStart, assignAgentStart } from "store/users/actions";

function AgentForm(props){

  const dispatch = useDispatch();
  const { clients } = props;
  const clientIds = clients.map(client=>{
    return client._id;
  });
  function assignAgent(e){
    dispatch(assignAgentStart({
      agentId:e.value._id,
      body:{
        clientIds
      },
      agent: {
        ...e.value
      }
    }));
  }
  
  useEffect(()=>{
    dispatch(getSalesAgentsStart({
      page:1,
      limit:1000
    }));
  }, []);
  
  
  const usersOptions = props.salesAgent.map(user=>{
    return  {
      label :`${user.firstName} ${user.lastName}`,
      value: {
        _id:user._id,
        firstName: user.firstName,
        lastName:user.lastName,
        email:user.email
      }
    } ; 
  }  
  );
  return (
    <React.Fragment >
      <div 
        style={{
          minWidth:"200px",
          // paddingInlineEnd: "1rem" 
        }} 
        // className="w-40"
      >
        <Select   
          classNamePrefix="select2-selection"
          placeholder="Select a sales agent"
          options= {usersOptions}
          onChange = {(e)=>assignAgent(e)}
        />
      </div>
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  error: state.clientReducer.error,
  clientPermissions: state.Profile.clientPermissions,
  salesAgent: state.usersReducer.salesAgent || []
});
export default connect(mapStateToProps, null)(withTranslation()(AgentForm));