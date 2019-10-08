import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../grooming/pet';
// import { GroomingComponent } from '../grooming/grooming.component'; 

// Angular service for managing products
@Injectable()
export class SignService {
    baseUrl = 'https://api.na2.echosign.com';
    uploadUrl = this.baseUrl + '/api/rest/v6/transientDocuments';
    agreementUrl = this.baseUrl + '/api/rest/v6/agreements';
    libraryUrl = this.baseUrl + '/api/rest/v6/libraryDocuments';

    integrationKey = 'Bearer 3AAABLblqZhAG7qkayUIOJhNzp2GW-e1PUbHr2byu0rBPCQYaCrnMN0I7zVFg_blSnOpqyTL5xanhWv22b2Vc_H9qURCS4UfB';
    httpOptions = {
        headers: new HttpHeaders({
            'Authorization': this.integrationKey
        })
    };

    constructor(private http: HttpClient) {}

    // Base Uri
    getBaseUris(): Observable<any> {
        return this.http.get(this.baseUrl + '/api/rest/v6/baseUris', this.httpOptions);
    }

    // Transient Documents ID
    uploadFile(file: File): Observable<any> {
        const selectedFile = (<HTMLInputElement>document.getElementById("inputFile")).files;
        const fileToLoad = selectedFile[0];
        console.log(fileToLoad);

        // Encodes file input content
        const formData = new FormData();
        formData.append('File-Name', fileToLoad.name);
        formData.append('File', fileToLoad);
        formData.append('Mime-Type', fileToLoad.type);
 
        return this.http.post(this.uploadUrl, formData, this.httpOptions);
    }

    // Retrieving Library Documents
    getLibraryDocuments(): Observable<any> {
        return this.http.get(this.libraryUrl, this.httpOptions);
    }

    // Retrieves the details of a library document
    getLibraryDocumentDetails(documentId: string): Observable<any> {
        return this.http.get(this.libraryUrl + '/' + documentId, this.httpOptions);
    }

    // Retrives the audit trail associated with the library doc
    getLibraryAuditTrail(documentId: string): Observable<any> {
        return this.http.get(this.libraryUrl + '/' + documentId + '/auditTrail', this.httpOptions);
    }

    // Retrieves the combined document associated with a library doc
    getCombinedDoc(documentId: string): Observable<any> {
        return this.http.get(this.libraryUrl + '/' + documentId + '/combinedDocument', this.httpOptions);
    }

    // Retrieves url of all visible pages of all the docs associated with a library doc
    getUrlVisiblePages(documentId: string): Observable<any> {
        return this.http.get(this.libraryUrl + '/' + documentId + '/combinedDocument/url', this.httpOptions);
    }

    // Retrieves the IDs of the documents associated with library doc
    getLibraryIDs(documentId: string): Observable<any> {
        return this.http.get(this.libraryUrl + '/' + documentId + '/documents', this.httpOptions);
    }

    // Retrieves the file stream of a document of library doc
    getFileStream(libDocId: string, documentId: string): Observable<any> {
        return this.http.get(this.libraryUrl + '/' + libDocId + '/documents/' + documentId);
    }

    // Retrieves image urls of all visible pages of a document associated with a library document
    getImageUrls(libDocId: string, documentId: string): Observable<any> {
        return this.http.get(this.libraryUrl + '/' + libDocId + '/documents/' + documentId + '/imageUrls');
    }

    // Retrieves data entered into the interactive form fields of the library document <- download reponse body

    // Retrieves information of members (creator) of the library document
    getMembersInfo(documentId: string): Observable<any> {
        return this.http.get(this.libraryUrl + '/' + documentId + '/members', this.httpOptions);
    }

    // Retrieves the events information for a library document
    getEventsInfo(documentId: string): Observable<any> {
        return this.http.get(this.libraryUrl + '/' + documentId + '/events', this.httpOptions);
    }

    // Retrieves the latest note of a library document for the API user
    getLatestNote(documentId: string): Observable<any> {
        return this.http.get(this.libraryUrl + '/' + documentId + '/me/note', this.httpOptions);
    }

    // Obtaining AgreementId
    getAgreementId(pet: Pet, documentId: string): Observable<any> {
        // Information about agreement
        const agreementInfo = {
            'fileInfos': [{
                'libraryDocumentId': documentId 
            }],
            'name': 'AgreementForm',
            'participantSetsInfo': [{
                'memberInfos': [{
                    'email': 'sophia.tan.ad+1@gmail.com'
                }],
                'order': 1,
                'role': 'SIGNER'
            }],
            "mergeFieldInfo": [
                {
                  "fieldName": "petName",
                  "defaultValue": pet.petName,
                },
                {
                    "fieldName": "bday",
                    "defaultValue": pet.bday,
                },
                {
                    "fieldName": "breed",
                    "defaultValue": pet.breed,
                },
                {
                    "fieldName": "weight",
                    "defaultValue": pet.weight,
                },
                {
                    "fieldName": "color",
                    "defaultValue": pet.color,
                  }
            ],
            'signatureType': 'ESIGN',
            'state': 'IN_PROCESS'
        };

        console.log(agreementInfo);

        return this.http.post(this.agreementUrl, agreementInfo, this.httpOptions);
    }

    // Adds template fields to an agreement
    addFormFields(agreementId: string): Observable<any> {
        return this.http.post(this.agreementUrl + '/' + agreementId + '/formFields', this.httpOptions)
    }
}
