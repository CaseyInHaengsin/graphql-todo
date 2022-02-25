import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import Loader from './Loader'
import { useAddTodoMutation } from '../utils/add-todo-mutation'

import ListItem from './ListItem'

const List = () => {
  const [listData, setListData] = useState([])
  const [inputData, setInputData] = useState('')
  const { loading, error, data } = useQuery(listQuery)
  const addTodo = useAddTodoMutation()

  useEffect(() => {
    if (!data) return
    setListData(data?.getItems)
  }, [loading])

  const handleChange = e => {
    setInputData(e.target.value)
  }

  const addItem = async () => {
    const data = await addTodo(inputData)
    const newTodo = {
      id: data?.data?.createItem?.id,
      text: data?.data?.createItem?.text
    }
    return newTodo && setListData([...listData, newTodo])
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

  if (loading) return <Loader />

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
            listItem={listItem?.text}
            itemIndex={itemIndex}
            key={listItem?.id}
            deleteItemFn={deleteItem}
            updateItemFn={updateItem}
          />
        )
      })}
    </div>
  )
}

const listQuery = gql`
  query getItems {
    getItems {
      id
      text
    }
  }
`

export default List
