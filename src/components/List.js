import React, { useState } from 'react'
import ListItem from './ListItem'

const List = () => {
  const [listData, setListData] = useState([])
  const [inputData, setInputData] = useState('')

  const handleChange = e => {
    console.log('e: ', e)
    setInputData(e.target.value)
  }

  const addItem = () => {
    return inputData && setListData([...listData, inputData])
  }

  const deleteItem = index => {
    let list = [...listData]
    list.splice(index, 1)
    setListData(list)
  }

  const updateItem = (index, newData) => {
    if (!newData) return
    let list = [...listData]
    list[index] = newData
    setListData(list)
  }

  return (
    <div className='list-container'>
      <input placeholder='To do' onChange={e => handleChange(e)} />
      <button
        onClick={addItem}
        style={{ fontSize: '1em', marginBottom: '10px' }}
      >
        +
      </button>
      {listData.map((listItem, itemIndex) => {
        return (
          <ListItem
            listItem={listItem}
            itemIndex={itemIndex}
            key={listItem + itemIndex}
            deleteItemFn={deleteItem}
            updateItemFn={updateItem}
          />
        )
      })}
    </div>
  )
}

export default List
