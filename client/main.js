import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
//import FormBuilder from '../imports/form_builder/index.jsx';
import React, {Component} from 'react';
import {render} from 'react-dom';
import FormBuilder from 'form-builder';
//const FormBuilder = Meteor.npmRequire('form-builder');
import customized_widgets from 'form-custom-components';
import preset from './preset.js';

import '../node_modules/react-ui-tree/dist/react-ui-tree.css';
import '../node_modules/react-datetime/css/react-datetime.css';


import './main.html';





class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: {
        demoForm:{
          schema:{
            "title": "A registration form",
            "description": "A simple form example.",
            "type": "object",
            "properties": {
              "firstName": {
                "type": "string",
                "title": "First name"
              },
              "lastName": {
                "type": "string",
                "title": "Last name"
              },
              "age": {
                "type": "integer",
                "title": "Age"
              },
              "bio": {
                "type": "string",
                "title": "Bio"
              },
              "password": {
                "type": "string",
                "title": "Password",
                "minLength": 3
              }
            }
          },
          uiSchema:{
            "age": {
              "ui:widget": "updown"
            },
            "bio": {
              "ui:widget": "textarea"
            },
            "password": {
              "ui:widget": "password",
              "ui:help": "Hint: Make it strong!"
            },
            "date": {
              "ui:widget": "alt-datetime"
            }
          }
        }
      }
    };
  }
  onSubmit(formSchema){
    this.state.db[formSchema.name]={
      schema:formSchema.schema,
      uiSchema:formSchema.uiSchema,
    };
    console.log(formSchema);
    //this.setState(this.state);
    this.setState({editing:undefined});
  }
  listForms(){
    return (<ul>
      {Object.keys(this.state.db).map((formName)=>(
        <li key={formName}><span>{formName}</span> <button onClick={this.onEdit.bind(this,formName)}>edit</button> </li>
      ))}
      </ul>);
  }
  onEdit(formName){
    console.log(formName);
    this.setState({editing:formName});
  }
  render(){
    if(this.state.editing){
      const schema = this.state.db[this.state.editing];
      return this.buildForm(this.state.editing,schema);
    }else{
      return this.listForms();
    }
  }
  buildForm(formName,formSchema){
    return (<FormBuilder
      preset={preset}
      fields={customized_widgets}
      onSubmit={this.onSubmit.bind(this)}
      formName={this.state.editing}
      formSchema={this.state.db[this.state.editing]}
      />);
  }
}

Meteor.startup(() => {
  console.log(preset);
  render(<App />, document.getElementById('app'));
});
