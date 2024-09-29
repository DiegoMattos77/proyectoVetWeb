import { Table, Column, DataType, Model, HasOne } from 'sequelize-typescript';
import Imagenes from './Imagenes.models';
@Table({
    tableName: 'productos',
    timestamps: false
})

class Productos extends Model {

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    })
    id_producto: number;

    @Column({
        type: DataType.STRING(30),
        allowNull: false
    })
    descripcion: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    id_proveedor: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    id_categoria: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    stock: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    precio_venta: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    precio_compra: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    stock_seguridad: number;

    @Column({
        type: DataType.STRING(8),
        allowNull: false
    })
    estado: string;

    @HasOne(() => Imagenes)
    imagen: Imagenes;
}

export default Productos;
