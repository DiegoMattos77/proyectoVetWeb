import { Table, Column, DataType, Model, ForeignKey, BelongsTo, PrimaryKey } from 'sequelize-typescript';
import Productos from './Productos.models';
import Pedidos from './Pedidos.models';

@Table({
    tableName: 'detalle_pedidos',
    timestamps: false
})
class DetallePedidos extends Model {

    @PrimaryKey
    @ForeignKey(() => Pedidos)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: false
    })
    id_pedido: number;

    @PrimaryKey
    @ForeignKey(() => Productos)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: false
    })
    id_producto: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    precio_venta: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    cantidad: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    descuento: number;

    @BelongsTo(() => Pedidos)
    pedido: Pedidos;

    @BelongsTo(() => Productos)
    producto: Productos;
}

export default DetallePedidos;