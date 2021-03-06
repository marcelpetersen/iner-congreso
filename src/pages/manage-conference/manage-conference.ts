import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { FormBuilder, Validators } from "@angular/forms";
import { AlertController } from "ionic-angular";

import { HomePage } from "./../home/home";
import { DataService } from "./../service/data.service";
import { AuthService } from "./../service/auth.service";

@Component({
  selector: "page-manage-conference",
  templateUrl: "manage-conference.html"
})
export class ManageConferencePage {
  submitAttempt: boolean;
  conferenceForm: any;
  conferences: any;
  showAddConference = false;
  smallDevice: boolean;
  showupdateConference = false;
  testCheckboxOpen = false;
  testCheckboxResult: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataS: DataService,
    private authS: AuthService,
    private formBuilder: FormBuilder,
    public alertCtrl: AlertController
  ) {
    this.setConferenceForm(undefined);
  }

  ionViewDidLoad() {
    if (!this.isAuthenticated()) this.navCtrl.push(HomePage);
    this.conferences = this.dataS.filterConferences("");
    this.smallDevice = this.dataS.isSmallDevice();
  }

  removeConference(conferenceID) {
    this.showupdateConference = false;
    this.dataS.deleteConference(conferenceID);
  }

  loadConferenceToEdit(conference) {
    this.showupdateConference = true;
    this.conferenceForm.reset();
    this.showAddConferenceForm(true);
    this.setConferenceForm(conference);
  }

  updateConference() {
    if (this.conferenceForm.valid) {
      this.dataS.updateConference(this.conferenceForm.value);
      this.conferenceForm.reset();
      this.setConferenceForm(undefined);
      this.showAddConference = false;
      this.showupdateConference = false;
    } else this.submitAttempt = true;
  }

  isAuthenticated() {
    return this.authS.isAuthenticated();
  }

  addConference() {
    // console.log(this.conferenceForm.value);

    if (this.conferenceForm.valid) {
      this.dataS.addConference(this.conferenceForm.value);
      this.conferenceForm.reset();
      this.setConferenceForm(undefined);
    } else this.submitAttempt = true;
  }

  showAddConferenceForm(showAddConference = false) {
    this.showAddConference = showAddConference;
  }

  addSpeakerCheckbox() {
    let speakers = this.dataS.filterSpeakers("").subscribe(data => {
      let alert = this.alertCtrl.create();
      alert.setTitle("Ponentes de esta Conferencia?");
      data.forEach(speaker => {
        alert.addInput({
          type: "checkbox",
          label: speaker.name,
          value: JSON.stringify({
            ["speakerID"]: speaker.$key,
            ["name"]: speaker.name
          })
        });
      });
      alert.addButton("Cancelar");
      alert.addButton({
        text: "Adicionar",
        handler: data => {
          if (data.length > 0) {
            let speakersConf = [];
            data.forEach(element => {
              speakersConf.push(JSON.parse(element));
            });
            this.conferenceForm.controls["speakers"].setValue(speakersConf);
          } else this.conferenceForm.controls["speakers"].setValue("");
          this.testCheckboxOpen = false;
          this.testCheckboxResult = data;
        }
      });
      alert.present();
      speakers.unsubscribe();
    });
  }
  addTopicCheckbox() {
    let speakers = this.dataS.getTopic().subscribe(data => {
      let alert = this.alertCtrl.create();
      alert.setTitle("Temas de esta Conferencia?");
      data.forEach(topic => {
        alert.addInput({
          type: "checkbox",
          label: topic.topic,
          value: JSON.stringify({
            ["topicID"]: topic.$key,
            ["topic"]: topic.topic
          })
        });
      });
      alert.addButton("Cancelar");
      alert.addButton({
        text: "Adicionar",
        handler: data => {
          if (data.length > 0) {
            let topicsConf = [];
            data.forEach(element => {
              topicsConf.push(JSON.parse(element));
            });
            this.conferenceForm.controls["topic"].setValue(topicsConf);
          } else this.conferenceForm.controls["topic"].setValue("");
          this.testCheckboxOpen = false;
          this.testCheckboxResult = data;
        }
      });
      alert.present();
      speakers.unsubscribe();
    });
  }
  addLocationCheckbox() {
    let locations = this.dataS.getLocation().subscribe(data => {
      let alert = this.alertCtrl.create();
      alert.setTitle("Temas de esta Conferencia?");
      data.forEach(location => {
        alert.addInput({
          type: "checkbox",
          label: location.name,
          value: JSON.stringify({
            ["locationID"]: location.$key,
            ["name"]: location.name
          })
        });
      });
      alert.addButton("Cancelar");
      alert.addButton({
        text: "Adicionar",
        handler: data => {
          if (data.length > 0) {
            let locationConf = [];
            data.forEach(element => {
              locationConf.push(JSON.parse(element));
            });
            this.conferenceForm.controls["location"].setValue(locationConf);
          } else this.conferenceForm.controls["location"].setValue("");
          this.testCheckboxOpen = false;
          this.testCheckboxResult = data;
        }
      });
      alert.present();
      locations.unsubscribe();
    });
  }

  setConferenceForm(conference) {
    if (conference === undefined) {
      this.conferenceForm = this.formBuilder.group({
        title: [
          "",
          Validators.compose([Validators.maxLength(300), Validators.required])
        ],
        date: [
          "2017-09-20",
          Validators.compose([Validators.maxLength(20), Validators.required])
        ],
        timeStart: [
          "",
          Validators.compose([Validators.maxLength(10), Validators.required])
        ],
        timeEnd: [
          "",
          Validators.compose([Validators.maxLength(10), Validators.required])
        ],
        profilePic: [
          "./../../assets/icon/favicon.ico",
          Validators.compose([
            ,
            Validators.maxLength(1000),
            Validators.required
          ])
        ],
        location: [
          "",
          Validators.compose([Validators.maxLength(100), Validators.required])
        ],
        topic: [
          "",
          Validators.compose([Validators.maxLength(100), Validators.required])
        ],
        speakers: [
          "",
          Validators.compose([Validators.maxLength(500), Validators.required])
        ],
        shortDescription: [
          "",
          Validators.compose([Validators.maxLength(1000), Validators.required])
        ],
        description: [
          "",
          Validators.compose([Validators.maxLength(10000), Validators.required])
        ]
      });
    } else {
      this.conferenceForm = this.formBuilder.group({
        id: [conference.$key],
        name: [
          conference.name,
          Validators.compose([
            Validators.maxLength(100),
            Validators.pattern("[a-zA-Z ]*"),
            Validators.required
          ])
        ],
        profilePic: [
          conference.profilePic,
          Validators.compose([
            ,
            Validators.maxLength(1000),
            Validators.required
          ])
        ],
        degree: [
          conference.degree,
          Validators.compose([Validators.maxLength(100), Validators.required])
        ],
        email: [
          conference.email,
          Validators.compose([Validators.maxLength(100), Validators.required])
        ],
        shortAbout: [
          conference.shortAbout,
          Validators.compose([Validators.maxLength(1000), Validators.required])
        ],
        about: [
          conference.about,
          Validators.compose([Validators.maxLength(10000), Validators.required])
        ]
      });
    }
  }
}
