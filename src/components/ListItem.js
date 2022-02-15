import React, { useState } from 'react'

const ListItem = ({ listItem, itemIndex, deleteItemFn, updateItemFn }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [editInputData, setEditInputData] = useState('')

  const handleEditClick = e => {
    updateItemFn(itemIndex, editInputData)
    setIsEdit(false)
  }

  const toggleEditMode = () => {
    setEditInputData(listItem)
    setIsEdit(true)
  }

  return (
    <div
      className='list-item-container'
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      {isEdit ? (
        <input
          value={editInputData}
          onChange={e => setEditInputData(e.target.value)}
        />
      ) : (
        <span onClick={toggleEditMode}>{itemIndex + 1 + '. ' + listItem}</span>
      )}

      {isEdit ? (
        <button onClick={e => handleEditClick(e)}>+</button>
      ) : (
        <button onClick={() => deleteItemFn(itemIndex)}>-</button>
      )}
    </div>
  )
}

export default ListItem
