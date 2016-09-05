import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import React, {Component} from 'react';
import {render} from 'react-dom';
import FormBuilder from 'form-builder';

import customized_widgets from 'form-custom-components';
import preset from './preset.js';
import FormFactory from 'form-components/dist-component/client';

import '../node_modules/react-ui-tree/dist/react-ui-tree.css';
import '../node_modules/react-datetime/css/react-datetime.css';

import { Mongo } from "meteor/mongo";

const Forms = new Mongo.Collection('Forms');

import './main.html';

let custom = {
    fields: {
        paymentStatus: FormFactory.createBuilder('cb-payment-status')
    },
    widgets: {
        dateTime: FormFactory.createBuilder('cb-datetime'),
        label: FormFactory.createBuilder('cb-label'),
        wysiwyg: FormFactory.createBuilder('cb-wysiwyg', {
            onChange: (value) => console.log(value)
        })
    }
}



class App extends Component {
  constructor(props) {
    super(props);

      const forms = Forms.find({}).fetch();
      this.state={};
  }
  onSubmit(formSchema){
    const form = Forms.findOne({name:formSchema.name});
      if(form) {
          Forms.update({_id:form._id},{
              $set:formSchema
          });
      }else{
          Forms.insert(formSchema);
      }
    console.log(formSchema);

    this.setState({editing:undefined});
  }
  listForms(){
      const forms = Forms.find({}).fetch();
    return (<ul className="list-group col-xs-12">
      {forms.map((form)=>(
              <li className="list-group-item" key={form.name}><span className="col-xs-3">{form.name}</span>

              <button className="btn btn-primary btn-xs" onClick={this.onEdit.bind(this,form)}>edit</button>
              <button className="btn btn-danger btn-xs" onClick={this.onRemove.bind(this,form)}>remove </button>

              </li>
      ))}
      </ul>);
  }
  onNew(){
      const existNames = Forms.find({}).fetch().map((a)=>a.name);
      console.log(existNames);
      let counter = 0;
      let newName = "new_form";
      if(existNames.indexOf(newName)>=0){
          while(existNames.indexOf(newName+counter)>=0) counter++;
          newName += counter;
      }
      this.setState({editing:{
          name:newName,
          schema:{
              type:"object",
              properties:{
              }
          },
          uiSchema:{
          }
      }});
  }
  onEdit(form){
    console.log(form.name);
    this.setState({editing:form});
  }
    onRemove(form){
        Forms.remove({_id:form._id});
        this.forceUpdate();
    }
  render(){

    if(this.state.editing){
      const schema = this.state.editing;
      return this.buildForm(this.state.editing.name,this.state.editing);
    }else{
        return (<div className="container">
                {this.listForms()}
                <button className="btn btn-success col-xs-12" onClick={this.onNew.bind(this)}>New Form</button>
                </div>);
    }
  }
  buildForm(formName,formSchema){
    return (<FormBuilder
      preset={preset}
      widgets={custom.widgets}
      fields={custom.fields}
      onSubmit={this.onSubmit.bind(this)}
      formName={this.state.editing.name}
      formSchema={this.state.editing}
      />);
  }
}

Meteor.startup(() => {
Meteor.subscribe('Forms', function(){
  console.log('fuuucccc');
  render(<App />, document.getElementById('app'));
});
});
