import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstans } from 'src/app/shared/global-constants';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  displayedColums: String[] = ['name','categoryName','description','price','edit'];
  dataSource:any;
  length1:any;
  responseMessage:any;

  constructor(private productService:ProductService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
  this.ngxService.start();
  this.tableData();
  }

  tableData(){
    this.productService.getProducts().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
      console.log("Datasources",this.dataSource)
    }, (error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }else{
        this.responseMessage= GlobalConstans.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstans.error);
    })
  }

  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value;
    this.dataSource.filter=filterValue.trim().toLocaleLowerCase();
  }


  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    };
    
    dialogConfig.width="850px";
    const dialogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    //componentInstance` kullanılarak açılan bir dialog bileşenin içindeki olaylar (events) dinlenir 
    //ve bu olaylar sayesinde alt bileşenin üst bileşeni etkilemesi sağlanır.
    const sub = dialogRef.componentInstance.onAddProduct.subscribe((response)=>{
      this.tableData();
    })
    
  }


  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data:values
    };
    
    dialogConfig.width="850px";
    const dialogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response)=>{
      this.tableData();
    })
    

  }

  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete '+values.name+' product',
      confirmation:true
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub= dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();
    });
  }

  deleteProduct(id:any){
    this.productService.delete(id).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage=response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,'succes');
    }, (error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }else{
        this.responseMessage= GlobalConstans.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstans.error);
    })
  }
  

  onChange(status:any,id:any){
    this.ngxService.start();
    var data ={
      status: status.toString(),
      id: id
    }
    this.productService.updateStatus(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage=response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,'succes');
    }, (error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }else{
        this.responseMessage= GlobalConstans.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstans.error);
    })
  }

}
