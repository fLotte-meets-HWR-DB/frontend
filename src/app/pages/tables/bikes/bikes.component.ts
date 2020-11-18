import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BikesService, CargoBikeResult } from 'src/app/services/bikes.service';
import { flatten } from 'src/app/helperFunctions/flattenObject';
import { deepen } from 'src/app/helperFunctions/deepenObject';
import { SchemaService } from 'src/app/services/schema.service';

import { logArrayInColumnInfoForm } from 'src/app/helperFunctions/logArrayInColumnInfoForm';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-bikes',
  templateUrl: './bikes.component.html',
  styleUrls: ['./bikes.component.scss'],
})
export class BikesComponent {
  /** this array defines the columns and headers of the table and the order they are displayed  */
  columnInfo: {
    name: string;
    header: string;
    acceptedForCreation?: boolean;
    requiredForCreation?: boolean;
    sticky?: boolean;
    readonly?: boolean;
    type?: string;
  }[] = [
    { name: 'name', header: 'Name', sticky: true },
    { name: 'id', header: 'ID', readonly: true },
    { name: 'group', header: 'Gruppe' },
    { name: 'modelName', header: 'Modell' },
    { name: 'insuranceData.billing', header: 'Versicherung Abrechnung' },
    { name: 'insuranceData.hasFixedRate', header: 'Pauschale j/n' },
    { name: 'insuranceData.fixedRate', header: 'Pauschale Betrag' },
    { name: 'insuranceData.name', header: 'Versicherer' },
    { name: 'insuranceData.benefactor', header: 'Kostenträger' },
    { name: 'insuranceData.noPnP', header: 'Nr. P&P' },
    {
      name: 'insuranceData.maintenanceResponsible',
      header: 'Wartung zuständig',
    },
    {
      name: 'insuranceData.maintenanceBenefactor',
      header: 'Wartung Kostenträger',
    },
    {
      name: 'insuranceData.maintenanceAgreement',
      header: 'Wartungsvereinbarung',
    },
    { name: 'insuranceData.projectAllowance', header: 'Projektzuschuss' },
    { name: 'insuranceData.notes', header: 'Sonstiges' },
    { name: 'dimensionsAndLoad.bikeLength', header: 'Länge' },
    { name: 'dimensionsAndLoad.bikeWeight', header: 'Gewicht' },
    { name: 'dimensionsAndLoad.bikeHeight', header: 'Höhe' },
    { name: 'dimensionsAndLoad.bikeWidth', header: 'Breite' },
    { name: 'dimensionsAndLoad.boxHeight', header: 'Boxhöhe' },
    { name: 'dimensionsAndLoad.boxLength', header: 'Boxlänge' },
    { name: 'dimensionsAndLoad.boxWidth', header: 'Boxbreite' },
    { name: 'dimensionsAndLoad.hasCoverBox', header: 'Boxabdeckung j/n' },
    { name: 'dimensionsAndLoad.lockable', header: 'Box abschließbar' },
    { name: 'dimensionsAndLoad.maxWeightBox', header: 'max Zuladung Box' },
    {
      name: 'dimensionsAndLoad.maxWeightLuggageRack',
      header: 'max Zuladung Gepäckträger',
    },
    { name: 'dimensionsAndLoad.maxWeightTotal', header: 'max Gesamtgewicht' },
    { name: 'numberOfChildren', header: 'Anzahl Kinder' },
    { name: 'numberOfWheels', header: 'Anzahl Räder' },
    { name: 'forCargo', header: 'für Lasten j/n' },
    { name: 'forChildren', header: 'für Kinder j/n' },
    { name: 'security.frameNumber', header: 'Rahmennummer' },
    { name: 'security.adfcCoding', header: 'ADFC Codierung' },
    {
      name: 'security.keyNumberAXAChain',
      header: 'Schlüsselnrummer Rahmenschloss',
    },
    {
      name: 'security.keyNumberFrameLock',
      header: 'Schlüsselnrummer AXA-Kette',
    },
    { name: 'security.policeCoding', header: 'Polizei Codierung' },
    { name: 'technicalEquipment.bicycleShift', header: 'Schaltung' },
    { name: 'technicalEquipment.isEBike', header: 'E-Bike j/n' },
    { name: 'technicalEquipment.hasLightSystem', header: 'Lichtanlage j/n' },
    { name: 'technicalEquipment.specialFeatures', header: 'Besonderheiten' },
    { name: 'stickerBikeNameState', header: 'Aufkleber Status' },
    { name: 'note', header: 'Aufkleber Kommentar' },
    { name: 'taxes.costCenter', header: 'Steuern Kostenstelle' },
    { name: 'taxes.organisationArea', header: 'Steuern Vereinsbereich' },
    { name: 'provider.id', header: '' },
    { name: 'provider.formName', header: '' },
    { name: 'provider.privatePerson.id', header: '' },
    { name: 'provider.privatePerson.person.id', header: '' },
    { name: 'provider.privatePerson.person.name', header: '' },
    { name: 'provider.privatePerson.person.firstName', header: '' },
    {
      name: 'provider.privatePerson.person.contactInformation.email',
      header: '',
    },
    { name: 'lendingStation.id', header: '' },
    { name: 'lendingStation.name', header: '' },
    { name: 'lendingStation.address.number', header: '' },
    { name: 'lendingStation.address.street', header: '' },
    { name: 'lendingStation.address.zip', header: '' },
  ];

  tableDataGQLType: string = 'CargoBike';
  tableDataGQLCreateInputType: string = 'CargoBikeCreateInput';
  tableDataGQLUpdateInputType: string = 'CargoBikeUpdateInput';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  additionalColumnsFront: string[] = ['select'];
  additionalColumnsBack: string[] = ['buttons'];
  displayedColumns: string[] = [];

  loadingRowIds: string[] = [];

  /** data source of the table */
  data: MatTableDataSource<any> = new MatTableDataSource();
  selection = new SelectionModel<CargoBikeResult>(true, []);

  reloadingTable = false;

  relockingInterval = null;
  relockingDuration = 1000 * 60 * 1;

  constructor(
    private bikesService: BikesService,
    private schemaService: SchemaService
  ) {}

  ngAfterViewInit() {
    this.addColumnPropertiesFromGQLSchemaToColumnInfo();
    this.data.paginator = this.paginator;
    this.data.sortingDataAccessor = (item, columnName) => {
      if (typeof item[columnName] === 'string') {
        return item[columnName].toLocaleLowerCase();
      }
    
      return item[columnName];
    }
    this.data.sort = this.sort;

    this.columnInfo.forEach((column) =>
      this.displayedColumns.push(column.name)
    );
    this.displayedColumns.unshift(this.additionalColumnsFront[0]);
    this.displayedColumns.push(this.additionalColumnsBack[0]);

    this.bikesService.loadingRowIds.subscribe((rowIds) => {
      this.loadingRowIds = rowIds;
    });

    this.bikesService.bikes.subscribe((newTableDataSource) => {
      this.reloadingTable = false;
      const tempDataSource = [];
      for (const row of newTableDataSource) {
        const oldRow = this.getRowById(row.id);
        /** make sure to not overwrite a row that is being edited */
        if (!oldRow) {
          tempDataSource.push(flatten(row));
        } else if (!(oldRow.isLockedByMe && row.isLockedByMe)) {
          tempDataSource.push(flatten(row));
        } else if (!!oldRow) {
          tempDataSource.push(oldRow);
        }
      }
      this.data.data = tempDataSource;
    });
    this.bikesService.loadBikes();

    this.relockingInterval = setInterval(() => {
      for (const row of this.data.data) {
        if (row.isLockedByMe) {
          this.bikesService.relockBike({ id: row.id });
        }
      }
    }, this.relockingDuration);
  }

  ngOnDestroy() {
    clearInterval(this.relockingInterval);
  }

  addColumnPropertiesFromGQLSchemaToColumnInfo() {
    for (const column of this.columnInfo) {
      const typeInformation = this.schemaService.getTypeInformation(
        this.tableDataGQLType,
        column.name
      );
      column.type = column.type || typeInformation.type;
    }
    for (const column of this.columnInfo) {
      const typeInformation = this.schemaService.getTypeInformation(
        this.tableDataGQLUpdateInputType,
        column.name
      );
      column.readonly = column.readonly || !typeInformation.isPartOfType;
    }
    for (const column of this.columnInfo) {
      const typeInformation = this.schemaService.getTypeInformation(
        this.tableDataGQLCreateInputType,
        column.name
      );
      column.requiredForCreation = typeInformation.isRequired;
      column.acceptedForCreation = typeInformation.isPartOfType;
    }
  }

  getHeader(propertyName: string) {
    return (
      this.columnInfo.find((column) => column.name === propertyName)?.header ||
      propertyName
    );
  }

  isStickyColumn(propertyName: string) {
    return (
      this.columnInfo.find((column) => column.name === propertyName)?.sticky ||
      false
    );
  }

  isLoading(id: string) {
    return this.loadingRowIds.includes(id);
  }

  validityChange(row: any, columnName: string, isValid: Event) {
    if (!row.FieldsValidity) {
      row['FieldsValidity'] = {};
    }
    row['FieldsValidity'][columnName] = isValid;
  }

  countUnvalidFields(row: any) {
    let unvalidFieldsCount = 0;
    if (!row.FieldsValidity) {
      return 99;
    }
    for (const prop in row.FieldsValidity) {
      if (!row.FieldsValidity[prop]) {
        unvalidFieldsCount++;
      }
    }
    return unvalidFieldsCount;
  }

  reloadTable() {
    this.reloadingTable = true;
    this.bikesService.loadBikes();
  }

  addEmptyRow() {
    this.data.data = [{ newObject: true }, ...this.data.data];
  }

  create(row: any) {
    const newBike = this.schemaService.filterObject(
      this.tableDataGQLCreateInputType,
      deepen(row)
    );
    this.bikesService.createBike({ bike: newBike });
  }

  edit(row: CargoBikeResult) {
    this.bikesService.lockBike({ id: row.id });
  }

  save(row: CargoBikeResult) {
    const deepenRow = this.schemaService.filterObject(
      this.tableDataGQLUpdateInputType,
      deepen(row)
    );
    this.bikesService.updateBike({ bike: deepenRow });
  }

  cancel(row: CargoBikeResult) {
    this.bikesService.unlockBike({ id: row.id });
  }

  getRowById(id: string) {
    return this.data.data.find((row) => row.id === id);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex + 2,
      event.currentIndex + 2
    ); // +2 because the first 2 (selection + name) columns are not dragable
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.data.data.forEach((row) => this.selection.select(row));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
  }
}
