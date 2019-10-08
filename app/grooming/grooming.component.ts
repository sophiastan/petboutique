import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignService } from '../services/sign.service';
import { Pet } from './pet';

@Component({
  selector: 'app-grooming',
  templateUrl: './grooming.component.html',
  styleUrls: ['./grooming.component.css']
})
export class GroomingComponent implements OnInit {
  pet: Pet;
  docName: string;
  customerEmail: string;
  fileToUpload: File = null;

  constructor(private router: Router, private signService: SignService) {
      this.pet = new Pet();
    }

  ngOnInit() {
  }

  // Function used for change event of file input
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

   // Test api calls
   test() {
    //this.getBaseUris();
    // this.getLibraryDocId();
    // this.getAgreementId();
    // this.getLibraryDocumentDetails();

    // this.getLibraryAuditTrail();
    // this.getCombinedDoc();

    // this.getUrlVisiblePages();
    // this.getLibraryIDs();
    // this.getMembersInfo();
    // this.getEventsInfo();
    // this.getLatestNote();
  }

  // Gets base uri to access other APIs
  getBaseUris() {
    this.signService.getBaseUris()
      .subscribe(data => {
        console.log(data);
      })
  }

  // Uploads doc and obtain document's ID
  uploadFile() {
    this.signService.uploadFile(this.fileToUpload)
      .subscribe(data => {
        // Get document Id
        const docId = data.transientDocumentId;
        console.log('transientDocumentId: ' + docId);
      },
      error => {
        // Display error from uploading document
        console.log(error);
      }
      );
  }

  // Gets library document id
  async getLibraryDocId(): Promise<string> {
    let docId = '';
    try {
        const data = await this.signService.getLibraryDocuments().toPromise(); 
        const doc = data.libraryDocumentList.find(x => x.name === this.docName);
        if (doc) {
          console.log('getLibraryDocId: ' + doc.id);
          docId = doc.id;
        }
    } catch (error) {
      console.log(error);
    }
    return docId;
  }

  // Get Document ID
  async getDocumentId(): Promise<string> {
    let docId = '';
    try {
      const docId = await this.getLibraryDocId();
      const data = await this.signService.getLibraryIDs(docId).toPromise();
      const doc = data.libraryDocumentList.find(x => x.name === this.docName);
    } catch (error) {
      console.log(error);
    }
    return docId;
  }

  // Get agreement id for doc id
  async getAgreementId(): Promise<string> {
    let agreementId = '';
    try {
      const docId = await this.getLibraryDocId();
      const data = await this.signService.getAgreementId(this.pet, docId).toPromise();
      agreementId = data.id;
      console.log('agreementId: ' + agreementId);
    } catch (error) {
      console.log(error);
    }
    return agreementId;
  }

  // Get details of library doc
  async getLibraryDocumentDetails(): Promise<string> {
  let documentDetails = '';
  try {
    const docId = await this.getLibraryDocId();
    const data = await this.signService.getLibraryDocumentDetails(docId).toPromise();
    documentDetails = JSON.stringify(data);
    console.log('Library Document Details: ' + documentDetails);
  } catch (error) {
    console.log(error);
  }
  return documentDetails;
  }

  // Get audit trail
  async getLibraryAuditTrail(): Promise<Blob> {
    let auditTrail;
    try {
      const docId = await this.getLibraryDocId();
      const data = await this.signService.getLibraryAuditTrail(docId).toPromise();
      auditTrail = data;
      const fileReader = new FileReader();
      // read file content on file loaded event
      fileReader.onload = () => {
        let base64 = fileReader.result;
        console.log('Library Audit Trail: ' + base64);
      }
      // convert data to base64
      fileReader.readAsDataURL(auditTrail);
    } catch (error) {
      console.log(error);
    }
    return auditTrail;
  }

  // Get combined document -> save as pdf from base64
  async getCombinedDoc(): Promise<Blob> {
    let combinedDoc;
    try {
      const docId = await this.getLibraryDocId();
      const data = await this.signService.getCombinedDoc(docId).toPromise();
      combinedDoc = data;
      const fileReader = new FileReader();
      // read file content on file loaded event
      fileReader.onload = () => {
        let base64 = fileReader.result;
        console.log("Library Combined Document: " + base64);
      }
      // convert data to base64
      fileReader.readAsDataURL(combinedDoc);
    } catch (error) {
      console.log(error);
    }
    return combinedDoc;
  }

  // Get url of all visible pages of all docs
  async getUrlVisiblePages(): Promise<string> {
    let urlVisiblePages = '';
    try {
      const docId = await this.getLibraryDocId();
      const data = await this.signService.getAgreementId(this.pet, docId).toPromise();
      urlVisiblePages = JSON.stringify(data)
      console.log('URL of Visible Pages: ' + urlVisiblePages);
    } catch (error) {
      console.log(error);
    }
    return urlVisiblePages;
  }

  // Get IDs of documents
  async getLibraryIDs(): Promise<string> {
    let libraryIDs = '';
    try {
      const docId = await this.getLibraryDocId();
      const data = await this.signService.getLibraryIDs(docId).toPromise();
      libraryIDs = JSON.stringify(data)
      console.log('URL of Visible Pages: ' + libraryIDs);
    } catch (error) {
      console.log(error);
    }
    return libraryIDs;
  }

  // Get file stream of a doc

  // Get image urls of all visible pages of a doc

  // Get data entered into the interactive form fields

  // Get members info
  async getMembersInfo(): Promise<string> {
    let membersInfo = '';
    try {
      const docId = await this.getLibraryDocId();
      const data = await this.signService.getMembersInfo(docId).toPromise();
      membersInfo = JSON.stringify(data)
      console.log('Members Info: ' + membersInfo);
    } catch (error) {
      console.log(error);
    }
    return membersInfo;
  }
  
  // Get events info
  async getEventsInfo(): Promise<string> {
    let eventsInfo = '';
    try {
      const docId = await this.getLibraryDocId();
      const data = await this.signService.getEventsInfo(docId).toPromise();
      eventsInfo = JSON.stringify(data)
      console.log('Events Info: ' + eventsInfo);
    } catch (error) {
      console.log(error);
    }
    return eventsInfo;
  }

  // Get latest note of library doc for the API user
  async getLatestNote(): Promise<string> {
    let latestNote = '';
    try {
      const docId = await this.getLibraryDocId();
      const data = await this.signService.getLatestNote(docId).toPromise();
      latestNote = JSON.stringify(data)
      console.log('Latest: ' + latestNote);
    } catch (error) {
      console.log(error);
    }
    return latestNote;
  }
}
