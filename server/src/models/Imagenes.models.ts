import { Table, Column, DataType, Model, ForeignKey } from "sequelize-typescript";
import Productos from "./Productos.models";

@Table({
    tableName: 'imagenes',
    timestamps: false
})
class Imagenes extends Model {

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    })
    id_imagen: number;

    @ForeignKey(() => Productos)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    id_productos: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    nombre_archivo: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    ruta: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    descripcion: string;

    @Column({
        type: DataType.BLOB,
        allowNull: false
    })
    imagen_bin: Blob;
}

export default Imagenes;
