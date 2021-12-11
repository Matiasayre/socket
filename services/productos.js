import database from "../config.js";

export default class Product{
   constructor(){
       database.schema.hasTable("Product").then(result=>{
           if(!result){
               database.schema.createTable("Product",table=>{
                   table.increments();
                   table.string("title").notNullable();
                   table.string("Price").notNullable();
                   table.string("thumbnail");
                   table.integer("email").notNullable();
                   table.boolean("asignado").notNullable().defaultTo(false);
                   table.timestamps(true,true);
               }).then(result=>{
                   console.log("product table created");
               })
           }
       })
   }
    getProducts= async ()=>{
        try{
            let products = await database.select().table("Product");
            return {status:"success",payload:products}
            }catch(error){
               return {error:"error",message:error}
            }
        
        
    }
    getProductById = async (id)=>{
        try{
          let product = await database.select().table("Product").where("id",id).first();
          if(product){
              return {status:"success",payload:product}
          }else return {status:"error",message:"product not found"}
        }catch(error){
         return {status:"error",message:error}
        }
    }
    registrerProduct = async (product)=>{
        
        try{
          let exists =await database.table("Product").select().where("email",product.email).first();
          if(exists)return{status:"error",message:"email already exists"};
          let result = await database.table("Product").insert(product)
          return {status:"success",payload:`producto registrado con el id ${result[0]}`}
          
        }catch(error){
            return {error:"error",message:error}
        }
    }
    updateProduct = async(id)=>{
        try{
            let productS = await database.select().table("Product").where("id",id).first();
          if(productS){
            let product = await database.table("Product").where("price","124$").update({price:"125$"});
            return {status:"success",payload:product}
        }else return {status:"error",message:"product not found"}
        }catch(error){
            return{error:"error",message:"no se pudo actualizar el producto"}
        }
    }
    deleteProduct = async(id)=>{
        try{
         await database.select().table("Product").where("id",id).delete();
         return {status:"success",message:"producto eliminado"}
        }catch(error){
           return{error:"error",message:"no se pudo eliminar el producto"}
        }
    }
}

