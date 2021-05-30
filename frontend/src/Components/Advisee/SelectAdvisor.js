import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import axios from "axios";
// import tileData from './tileData';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: '60vw',
        height: '80vh',
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
});


/*//  The example data is structured as follows:

  import image from 'path/to/image.jpg';
  [etc...]

  const tileData = [
    {
      img: image,
      title: 'Image',
      author: 'author',
    },
    {
      [etc...]
    },
  ];*/

//TODO:  Create Media Card and map advisors to it

// class SelectAdvisor extends Component { 
//     render() {
//         return < div />
//     }
// }

// export default SelectAdvisor

const tileData = [
    {
      img: 'foo',
      title: 'Image',
      author: 'author',
    }
]

class SelectAdvisor extends Component{

            state = {
                advisors: [
                    {name:  'Ali Kooshesh - DUMMY DATA', pic: 'https://news.sonoma.edu/sites/news/files/field/image/ssumobileappweb.jpg', advisor_id: 12345},
                    {name: 'Suzanne Rivoire - DUMMY DATA', pic: 'https://rivoire.cs.sonoma.edu/images/smr_cropped.jpg', advisor_id: 12345},
                    {name: 'Gurman Gill - DUMMY DATA', pic: 'https://gill.cs.sonoma.edu/images/GurmanGill.JPG', advisor_id: 12345},
                    {name: 'Mark Gondree -- DUMMY DATA', pic: 'https://www.gondree.com/images/nps.jpg', advisor_id: 12345},

                ]
            }

            async componentWillMount() {
                console.log(this.props)
                try {
                  console.log('select advisor mounting')
                    const { data } = await axios.get("http://localhost:8239/v1/advisee/getAllAdvisors")
                    console.log(data);
                    const events = data.data.map(event => {
            
                        let { first_name, last_name, advisor_id } = event
            
                        return { name: `${first_name} ${last_name}`, 
                        advisor_id,
                        pic: 'https://pbs.twimg.com/profile_images/935325968280907776/AcBo6zJc_400x400.jpg' } 
            
                    })
            
                    this.setState({ advisors: [...this.state.advisors, ...events] })

                } catch (e) {
                    console.log("wtf is Darin doing")
                } 
              }

            render (){
                let { classes } = this.props
                // const selectAdvisor = 'selectAdvisor' + ele.title.importance;
                return(
                    <div className={classes.root}>
                   
                       <GridList cellHeight={250} className={classes.gridList}>
                            <GridListTile key="Subheader" cols={2} style={{height: 'auto' }}> 
                                <ListSubheader component="div">Select An Advisor</ListSubheader>
                            </GridListTile>
                            {this.state.advisors.map((tile, idx) => (
                            <GridListTile 
                                onClick={() => this.props.history.push(`/advisee/${tile.advisor_id}`)}
                                key={idx}
                            >
                                <img src={tile.pic} alt={tile.name} />
                                <GridListTileBar
                                    title={tile.name}
                                    subtitle={<span>Select Advisor</span>}
                                    actionIcon={
                                        <IconButton className={classes.icon}>
                                            <PersonIcon />
                                        </IconButton>
                                   } 
                                ></GridListTileBar>
                            }</GridListTile>
                        ))}
                        </GridList>
                    </div>
            )}
                        }




SelectAdvisor.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectAdvisor);




//"https://randomuser.me/api/portraits/med/men/1235.jpg"




