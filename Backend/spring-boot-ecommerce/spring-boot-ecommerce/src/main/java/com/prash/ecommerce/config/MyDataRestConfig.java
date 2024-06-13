package com.prash.ecommerce.config;

import com.prash.ecommerce.entity.Product;
import com.prash.ecommerce.entity.ProductCategory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {



    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager=theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] theUnSupportedActions={HttpMethod.POST,HttpMethod.POST,HttpMethod.DELETE};

        //disable http methods for put post and delete-->Product
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions));

        //disable http methods for put post and delete-->Product Category
        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnSupportedActions));

        //call an internal helper method
        esposeIds(config);
    }

    private void esposeIds(RepositoryRestConfiguration config) {
        //expose entity ids

        //get a list of all entity classes from entity manager
        Set<EntityType<?>> entities=entityManager.getMetamodel().getEntities();

        //create an array of entity types
        List<Class> entityClass=new ArrayList<>();

        //get entity types for entities
        for(EntityType tempEntity:entities){
            entityClass.add(tempEntity.getJavaType());
        }

        //expose the entity ids
        Class[] domainTypes=entityClass.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
