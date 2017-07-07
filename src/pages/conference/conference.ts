import { AboutPage } from "./../about/about";
import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { FormControl } from "@angular/forms";
import { ConferenceDetailPage } from "./../conference-detail/conference-detail";
import { DataService } from "./../service/data.service";
import "rxjs/add/operator/debounceTime";

@Component({
  selector: "page-conference",
  templateUrl: "conference.html"
})
export class ConferencePage {
  conferences: any;
  topics: any;
  searchTerm = "";
  searchControl: FormControl;
  dayControl: FormControl;
  topicControl: FormControl;
  searching: any = false;
  filterDay = [];
  filterTopic = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataS: DataService
  ) {
    this.searchControl = new FormControl();
    this.dayControl = new FormControl();
    this.topicControl = new FormControl();
  }
  ionViewDidLoad() {
    this.topics = this.dataS.getTopic();
    this.setFilteredConferences();
    this.searchControl.valueChanges.debounceTime(400).subscribe(search => {
      this.searching = false;
      this.setFilteredConferences();
    });
    this.dayControl.valueChanges.debounceTime(400).subscribe(search => {
      this.searching = false;
      this.setFilteredConferences();
    });
        this.topicControl.valueChanges.debounceTime(400).subscribe(search => {
      this.searching = false;
      this.setFilteredConferences();
    });
  }

  onSearchInput() {
    this.searching = true;
  }

  setFilteredConferences() {
    this.conferences = this.dataS.filterConferences(
      this.searchTerm,
      this.filterDay,
      this.filterTopic
    );
  }

  goToConferenceDetail(conferenceID) {
    this.navCtrl.push(ConferenceDetailPage, {
      conferenceID: conferenceID
    });
  }

  itemTapped(event, item) {
    this.navCtrl.push(AboutPage, {
      item: item
    });
  }
}
