import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BikesService, CargoBikeResult } from 'src/app/services/bikes.service';
import { flatten } from 'src/app/helperFunctions/flattenObject';
import { deepen } from 'src/app/helperFunctions/deepenObject';
import { SchemaService } from 'src/app/services/schema.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bikes',
  templateUrl: './bikes.component.html',
  styleUrls: ['./bikes.component.scss'],
})
export class BikesComponent {
  columnInfo = [
    {
      name: 'name',
      translation: 'Name',
      sticky: true,
      link: (row: any) => {
        return '/bike/' + row.id;
      },
    },
    { name: 'id', translation: 'ID', readonly: true },
    { name: 'group', translation: 'Gruppe' },
    { name: 'modelName', translation: 'Modell' },
    { name: 'insuranceData.billing', translation: 'Versicherung Abrechnung' },
    { name: 'insuranceData.hasFixedRate', translation: 'Pauschale j/n' },
    { name: 'insuranceData.fixedRate', translation: 'Pauschale Betrag' },
    { name: 'insuranceData.name', translation: 'Versicherer' },
    { name: 'insuranceData.benefactor', translation: 'Kostenträger' },
    { name: 'insuranceData.noPnP', translation: 'Nr. P&P' },
    {
      name: 'insuranceData.maintenanceResponsible',
      translation: 'Wartung zuständig',
    },
    {
      name: 'insuranceData.maintenanceBenefactor',
      translation: 'Wartung Kostenträger',
    },
    {
      name: 'insuranceData.maintenanceAgreement',
      translation: 'Wartungsvereinbarung',
    },
    { name: 'insuranceData.projectAllowance', translation: 'Projektzuschuss' },
    { name: 'insuranceData.notes', translation: 'Sonstiges' },
    { name: 'dimensionsAndLoad.bikeLength', translation: 'Länge' },
    { name: 'dimensionsAndLoad.bikeWeight', translation: 'Gewicht' },
    { name: 'dimensionsAndLoad.bikeHeight', translation: 'Höhe' },
    { name: 'dimensionsAndLoad.bikeWidth', translation: 'Breite' },
    { name: 'dimensionsAndLoad.boxHeight', translation: 'Boxhöhe' },
    { name: 'dimensionsAndLoad.boxLength', translation: 'Boxlänge' },
    { name: 'dimensionsAndLoad.boxWidth', translation: 'Boxbreite' },
    { name: 'dimensionsAndLoad.hasCoverBox', translation: 'Boxabdeckung j/n' },
    { name: 'dimensionsAndLoad.lockable', translation: 'Box abschließbar' },
    { name: 'dimensionsAndLoad.maxWeightBox', translation: 'max Zuladung Box' },
    {
      name: 'dimensionsAndLoad.maxWeightLuggageRack',
      translation: 'max Zuladung Gepäckträger',
    },
    {
      name: 'dimensionsAndLoad.maxWeightTotal',
      translation: 'max Gesamtgewicht',
    },
    { name: 'numberOfChildren', translation: 'Anzahl Kinder' },
    { name: 'numberOfWheels', translation: 'Anzahl Räder' },
    { name: 'forCargo', translation: 'für Lasten j/n' },
    { name: 'forChildren', translation: 'für Kinder j/n' },
    { name: 'security.frameNumber', translation: 'Rahmennummer' },
    { name: 'security.adfcCoding', translation: 'ADFC Codierung' },
    {
      name: 'security.keyNumberAXAChain',
      translation: 'Schlüsselnrummer Rahmenschloss',
    },
    {
      name: 'security.keyNumberFrameLock',
      translation: 'Schlüsselnrummer AXA-Kette',
    },
    { name: 'security.policeCoding', translation: 'Polizei Codierung' },
    { name: 'technicalEquipment.bicycleShift', translation: 'Schaltung' },
    { name: 'technicalEquipment.isEBike', translation: 'E-Bike j/n' },
    {
      name: 'technicalEquipment.hasLightSystem',
      translation: 'Lichtanlage j/n',
    },
    {
      name: 'technicalEquipment.specialFeatures',
      translation: 'Besonderheiten',
    },
    { name: 'stickerBikeNameState', translation: 'Aufkleber Status' },
    { name: 'note', translation: 'Aufkleber Kommentar' },
    { name: 'taxes.costCenter', translation: 'Steuern Kostenstelle' },
    { name: 'taxes.organisationArea', translation: 'Steuern Vereinsbereich' },
    { name: 'provider.id', translation: '' },
    { name: 'provider.formName', translation: '' },
    { name: 'provider.privatePerson.id', translation: '' },
    { name: 'provider.privatePerson.person.id', translation: '' },
    { name: 'provider.privatePerson.person.name', translation: '' },
    { name: 'provider.privatePerson.person.firstName', translation: '' },
    {
      name: 'provider.privatePerson.person.contactInformation.email',
      translation: '',
    },
    { name: 'lendingStation.id', translation: '' },
    { name: 'lendingStation.name', translation: '' },
    { name: 'lendingStation.address.number', translation: '' },
    { name: 'lendingStation.address.street', translation: '' },
    { name: 'lendingStation.address.zip', translation: '' },
  ];

  dataService: any;

  tableDataGQLType: string = 'CargoBike';
  tableDataGQLCreateInputType: string = 'CargoBikeCreateInput';
  tableDataGQLUpdateInputType: string = 'CargoBikeUpdateInput';

  loadingRowIds: string[] = [];
  constructor(
    private bikesService: BikesService
  ) {}

  ngOnInit() {
    this.dataService = this.bikesService;
  }

  create(row: any) {
    this.bikesService.createBike({ bike: row });
  }

  edit(row: any) {
    this.bikesService.lockBike({ id: row.id });
  }

  relock(row: any) {
    this.bikesService.relockBike({ id: row.id });
  }

  save(row: any) {
    this.bikesService.updateBike({ bike: row });
  }

  cancel(row: any) {
    this.bikesService.unlockBike({ id: row.id });
  }

  delete(row: any) {
    this.bikesService.deleteBike({ id: row.id });
  }
}
