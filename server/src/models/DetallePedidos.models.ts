import { Table, Column, DataType, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Productos from './Productos.models';
import Pedidos from './Pedidos.models';

@Table({
    tableName: 'detalle_pedidos',
    timestamps: false
})

class DetallePedidos extends Model {

    @ForeignKey(() => Pedidos)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    id_pedido: number;

    @ForeignKey(() => Productos)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
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